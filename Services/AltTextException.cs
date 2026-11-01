namespace AltTextGeneratorAI.Umbraco.Services;

/// <summary>An error with a message that is safe to show to an editor.</summary>
public class AltTextException : Exception
{
    public int StatusCode { get; }

    public AltTextException(string message, int statusCode = 400) : base(message)
    {
        StatusCode = statusCode;
    }
}
