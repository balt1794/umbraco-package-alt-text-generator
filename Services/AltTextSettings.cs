using Microsoft.Extensions.Configuration;
using Umbraco.Cms.Core.Services;

namespace AltTextGeneratorAI.Umbraco.Services;

/// <summary>
/// The API key and endpoint. A key saved in the dashboard wins over one in appsettings
/// ("AltTextGeneratorAI:ApiKey"), so a site can also set it in its deployment.
/// </summary>
public class AltTextSettings
{
    private readonly IKeyValueService _keyValueService;
    private readonly IConfiguration _configuration;

    public AltTextSettings(IKeyValueService keyValueService, IConfiguration configuration)
    {
        _keyValueService = keyValueService;
        _configuration = configuration;
    }

    public string ApiKey
    {
        get
        {
            var saved = _keyValueService.GetValue(Constants.ApiKeyStorageKey);
            if (!string.IsNullOrWhiteSpace(saved))
            {
                return saved.Trim();
            }

            return (_configuration["AltTextGeneratorAI:ApiKey"] ?? string.Empty).Trim();
        }
    }

    public string Endpoint
    {
        get
        {
            var endpoint = (_configuration["AltTextGeneratorAI:Endpoint"] ?? string.Empty).Trim();
            return endpoint.Length > 0 ? endpoint : Constants.DefaultEndpoint;
        }
    }

    /// <summary>The endpoint that reports the credits left, next to the generate endpoint.</summary>
    public string VerifyEndpoint
    {
        get
        {
            var endpoint = Endpoint;
            var index = endpoint.LastIndexOf("/api/", StringComparison.Ordinal);
            return index >= 0 ? endpoint[..index] + "/api/verify" : endpoint;
        }
    }

    public void SaveApiKey(string apiKey)
    {
        _keyValueService.SetValue(Constants.ApiKeyStorageKey, apiKey.Trim());
    }
}
