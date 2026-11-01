namespace AltTextGeneratorAI.Umbraco.Models;

public class SettingsResponseModel
{
    public required bool HasKey { get; init; }

    public required bool CanEditKey { get; init; }

    public int? Credits { get; init; }
}

public class SaveSettingsRequestModel
{
    public string? ApiKey { get; init; }
}

public class ImageItemModel
{
    public required Guid Key { get; init; }

    public required string Name { get; init; }

    public required string Url { get; init; }

    /// <summary>A small version of the image for the list, with the signature the image processor asks for.</summary>
    public required string Thumbnail { get; init; }

    public required string AltText { get; init; }
}

public class ImagesResponseModel
{
    public required long Total { get; init; }

    public required IEnumerable<ImageItemModel> Items { get; init; }
}

public class GenerateRequestModel
{
    public required Guid Key { get; init; }

    public string? Language { get; init; }
}

public class GenerateResponseModel
{
    public required string AltText { get; init; }

    public int? CreditsLeft { get; init; }
}

public class SaveItemModel
{
    public required Guid Key { get; init; }

    public required string AltText { get; init; }
}

public class SaveRequestModel
{
    public required IEnumerable<SaveItemModel> Items { get; init; }
}

public class SaveResponseModel
{
    public required int Saved { get; init; }
}
