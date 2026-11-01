using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace AltTextGeneratorAI.Umbraco.Services;

/// <summary>Talks to the Alt Text Generator AI service from the server, so the API key never reaches the browser.</summary>
public class AltTextClient
{
    private readonly HttpClient _http;
    private readonly AltTextSettings _settings;

    public AltTextClient(HttpClient http, AltTextSettings settings)
    {
        _http = http;
        _settings = settings;
    }

    public bool HasKey => _settings.ApiKey.Length > 0;

    public async Task<(string AltText, int? CreditsLeft)> GenerateAsync(string imageDataUrl, string language, CancellationToken cancellationToken)
    {
        var apiKey = _settings.ApiKey;
        if (apiKey.Length == 0)
        {
            throw new AltTextException("Add your API key first.", 401);
        }

        HttpResponseMessage response;
        try
        {
            response = await _http.PostAsJsonAsync(
                _settings.Endpoint,
                new { image = imageDataUrl, language, wpkey = apiKey },
                cancellationToken);
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
        {
            throw new AltTextException("Could not reach Alt Text Generator AI. Check the server connection and try again.", 502);
        }

        using (response)
        {
            var body = (await response.Content.ReadAsStringAsync(cancellationToken)).Trim();

            if (response.StatusCode == HttpStatusCode.Unauthorized)
            {
                throw new AltTextException("Invalid API key.", 401);
            }

            if (response.StatusCode == HttpStatusCode.PaymentRequired)
            {
                throw new AltTextException("No credits left on this API key.", 402);
            }

            if ((int)response.StatusCode >= 400)
            {
                var message = body.Length is > 0 and < 160 && !body.StartsWith('<')
                    ? body
                    : $"Generation failed ({(int)response.StatusCode}).";
                throw new AltTextException(message, (int)response.StatusCode);
            }

            if (body.Length == 0)
            {
                throw new AltTextException("No alt text came back. Try again.", 502);
            }

            int? creditsLeft = null;
            if (response.Headers.TryGetValues("X-Credits-Left", out var values)
                && int.TryParse(values.FirstOrDefault(), out var left))
            {
                creditsLeft = left;
            }

            return (body, creditsLeft);
        }
    }

    /// <summary>The credits left on the key. Checking never uses a credit.</summary>
    public async Task<int?> GetCreditsAsync(CancellationToken cancellationToken)
    {
        var apiKey = _settings.ApiKey;
        if (apiKey.Length == 0)
        {
            return null;
        }

        try
        {
            using var response = await _http.PostAsJsonAsync(_settings.VerifyEndpoint, new { apiKey }, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            using var json = JsonDocument.Parse(await response.Content.ReadAsStringAsync(cancellationToken));
            return json.RootElement.TryGetProperty("freeRewritesLeft", out var left) && left.TryGetInt32(out var value)
                ? value
                : null;
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException)
        {
            return null;
        }
    }
}
