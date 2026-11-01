using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Processing;

namespace AltTextGeneratorAI.Umbraco.Services;

/// <summary>
/// Shrinks an image to a JPEG with its longest side at most 1024 px before it is sent,
/// so a large original never goes over the network.
/// </summary>
public static class ImagePreparer
{
    public const int MaxSide = 1024;
    private const int MaxDataUrlLength = 5_500_000;

    /// <returns>A data URL, or null when the image cannot be read (for example an SVG).</returns>
    public static async Task<string?> ToDataUrlAsync(Stream source, CancellationToken cancellationToken)
    {
        try
        {
            using var image = await Image.LoadAsync(source, cancellationToken);
            image.Mutate(ctx =>
            {
                ctx.AutoOrient();
                if (Math.Max(image.Width, image.Height) > MaxSide)
                {
                    ctx.Resize(new ResizeOptions { Mode = ResizeMode.Max, Size = new Size(MaxSide, MaxSide) });
                }

                // JPEG has no transparency, so transparent PNG and WebP areas become white.
                ctx.BackgroundColor(Color.White);
            });

            using var output = new MemoryStream();
            await image.SaveAsJpegAsync(output, new JpegEncoder { Quality = 80 }, cancellationToken);

            var dataUrl = "data:image/jpeg;base64," + Convert.ToBase64String(output.ToArray());
            return dataUrl.Length > MaxDataUrlLength ? null : dataUrl;
        }
        catch (Exception ex) when (ex is UnknownImageFormatException or InvalidImageContentException or NotSupportedException)
        {
            return null;
        }
    }
}
