using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;

namespace AltTextGeneratorAI.Umbraco;

public static class PublishedContentExtensions
{
    /// <summary>The alt text written for an image in the media library, or an empty string when it has none.</summary>
    public static string GetAltText(this IPublishedContent media) =>
        media.Value<string>(Constants.AltTextAlias)?.Trim() ?? string.Empty;
}
