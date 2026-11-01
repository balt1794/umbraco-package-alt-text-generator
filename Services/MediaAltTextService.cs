using System.Text.Json;
using Microsoft.Extensions.Logging;
using Umbraco.Cms.Core.IO;
using Umbraco.Cms.Core.Media;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Strings;
using AltTextGeneratorAI.Umbraco.Models;

namespace AltTextGeneratorAI.Umbraco.Services;

/// <summary>Reads the images of the media library and keeps their alt text in the "altText" property of the Image media type.</summary>
public class MediaAltTextService
{
    private const string ImageTypeAlias = "Image";
    private const int PageSize = 250;
    private const int MaxImages = 5000;

    private readonly IMediaService _mediaService;
    private readonly IMediaTypeService _mediaTypeService;
    private readonly IDataTypeService _dataTypeService;
    private readonly IShortStringHelper _shortStringHelper;
    private readonly MediaFileManager _mediaFileManager;
    private readonly IImageUrlGenerator _imageUrlGenerator;
    private readonly ILogger<MediaAltTextService> _logger;

    public MediaAltTextService(
        IMediaService mediaService,
        IMediaTypeService mediaTypeService,
        IDataTypeService dataTypeService,
        IShortStringHelper shortStringHelper,
        MediaFileManager mediaFileManager,
        IImageUrlGenerator imageUrlGenerator,
        ILogger<MediaAltTextService> logger)
    {
        _mediaService = mediaService;
        _mediaTypeService = mediaTypeService;
        _dataTypeService = dataTypeService;
        _shortStringHelper = shortStringHelper;
        _mediaFileManager = mediaFileManager;
        _imageUrlGenerator = imageUrlGenerator;
        _logger = logger;
    }

    /// <summary>Adds the "altText" property to the Image media type when it is not there yet.</summary>
    public async Task EnsurePropertyAsync()
    {
        var imageType = _mediaTypeService.Get(ImageTypeAlias);
        if (imageType is null || imageType.PropertyTypeExists(Constants.AltTextAlias))
        {
            return;
        }

        var textBox = (await _dataTypeService.GetByEditorAliasAsync("Umbraco.TextBox")).FirstOrDefault();
        if (textBox is null)
        {
            _logger.LogWarning("Alt Text Generator AI could not find the text box data type, so the altText property was not added.");
            return;
        }

        var propertyType = new PropertyType(_shortStringHelper, textBox, Constants.AltTextAlias)
        {
            Name = "Alt text",
            Description = "Describes the image for people who cannot see it and for search engines.",
        };

        imageType.AddPropertyType(propertyType, "image", "Image");
        await _mediaTypeService.UpdateAsync(imageType, global::Umbraco.Cms.Core.Constants.Security.SuperUserKey);
    }

    public IReadOnlyList<ImageItemModel> GetImages()
    {
        var imageType = _mediaTypeService.Get(ImageTypeAlias);
        if (imageType is null)
        {
            return Array.Empty<ImageItemModel>();
        }

        var items = new List<ImageItemModel>();
        long pageIndex = 0;
        while (items.Count < MaxImages)
        {
            var page = _mediaService.GetPagedOfType(imageType.Id, pageIndex, PageSize, out var total, null, null).ToList();
            foreach (var media in page)
            {
                if (media.Trashed)
                {
                    continue;
                }

                var url = GetFileUrl(media);
                if (url is null)
                {
                    continue;
                }

                items.Add(new ImageItemModel
                {
                    Key = media.Key,
                    Name = media.Name ?? string.Empty,
                    Url = url,
                    Thumbnail = GetThumbnailUrl(url),
                    AltText = media.GetValue<string>(Constants.AltTextAlias)?.Trim() ?? string.Empty,
                });
            }

            pageIndex++;
            if (page.Count == 0 || pageIndex * PageSize >= total)
            {
                break;
            }
        }

        return items;
    }

    /// <summary>Opens the image of a media item and prepares it for the service.</summary>
    public async Task<string> GetImageDataUrlAsync(Guid key, CancellationToken cancellationToken)
    {
        var media = _mediaService.GetById(key) ?? throw new AltTextException("That image no longer exists.", 404);
        var url = GetFileUrl(media) ?? throw new AltTextException("That item has no image file.", 400);

        var fileSystem = _mediaFileManager.FileSystem;
        var path = fileSystem.GetRelativePath(url);
        if (!fileSystem.FileExists(path))
        {
            throw new AltTextException("The image file could not be found.", 404);
        }

        await using var stream = fileSystem.OpenFile(path);
        var dataUrl = await ImagePreparer.ToDataUrlAsync(stream, cancellationToken);
        return dataUrl ?? throw new AltTextException("This image type cannot be used (for example SVG), or the image is too large.", 415);
    }

    public int Save(IEnumerable<SaveItemModel> items)
    {
        var saved = 0;
        foreach (var item in items)
        {
            var media = _mediaService.GetById(item.Key);
            if (media is null || !media.HasProperty(Constants.AltTextAlias))
            {
                continue;
            }

            media.SetValue(Constants.AltTextAlias, item.AltText.Trim());
            if (_mediaService.Save(media).Success)
            {
                saved++;
            }
        }

        return saved;
    }

    private string GetThumbnailUrl(string url)
    {
        var thumbnail = _imageUrlGenerator.GetImageUrl(new ImageUrlGenerationOptions(url)
        {
            Width = 144,
            Height = 144,
            ImageCropMode = ImageCropMode.Max,
        });

        return string.IsNullOrEmpty(thumbnail) ? url : thumbnail;
    }

    private static string? GetFileUrl(IMedia media)
    {
        var value = media.GetValue<string>("umbracoFile");
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        if (!value.TrimStart().StartsWith('{'))
        {
            return value;
        }

        try
        {
            using var json = JsonDocument.Parse(value);
            return json.RootElement.TryGetProperty("src", out var src) ? src.GetString() : null;
        }
        catch (JsonException)
        {
            return null;
        }
    }
}
