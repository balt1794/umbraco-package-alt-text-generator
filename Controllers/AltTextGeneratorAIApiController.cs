using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Core.Security;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Extensions;
using AltTextGeneratorAI.Umbraco.Models;
using AltTextGeneratorAI.Umbraco.Services;

namespace AltTextGeneratorAI.Umbraco.Controllers
{
    [ApiVersion("1.0")]
    [ApiExplorerSettings(GroupName = "AltTextGeneratorAI.Umbraco")]
    public class AltTextGeneratorAIApiController : AltTextGeneratorAIApiControllerBase
    {
        private readonly IBackOfficeSecurityAccessor _backOfficeSecurityAccessor;
        private readonly AltTextSettings _settings;
        private readonly AltTextClient _client;
        private readonly MediaAltTextService _media;

        public AltTextGeneratorAIApiController(
            IBackOfficeSecurityAccessor backOfficeSecurityAccessor,
            AltTextSettings settings,
            AltTextClient client,
            MediaAltTextService media)
        {
            _backOfficeSecurityAccessor = backOfficeSecurityAccessor;
            _settings = settings;
            _client = client;
            _media = media;
        }

        [HttpGet("settings")]
        [ProducesResponseType<SettingsResponseModel>(StatusCodes.Status200OK)]
        public async Task<SettingsResponseModel> GetSettings(CancellationToken cancellationToken)
        {
            var user = _backOfficeSecurityAccessor.BackOfficeSecurity?.CurrentUser;

            return new SettingsResponseModel
            {
                HasKey = _client.HasKey,
                CanEditKey = user?.IsAdmin() ?? false,
                Credits = await _client.GetCreditsAsync(cancellationToken),
            };
        }

        [HttpPost("settings")]
        [Authorize(Policy = AuthorizationPolicies.RequireAdminAccess)]
        [ProducesResponseType<SettingsResponseModel>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<SettingsResponseModel>> SaveSettings(SaveSettingsRequestModel model, CancellationToken cancellationToken)
        {
            var apiKey = model.ApiKey?.Trim() ?? string.Empty;
            if (apiKey.Length == 0)
            {
                return Problem(detail: "Paste your API key first.", statusCode: 400, title: "API key missing");
            }

            _settings.SaveApiKey(apiKey);
            var credits = await _client.GetCreditsAsync(cancellationToken);
            if (credits is null)
            {
                _settings.SaveApiKey(string.Empty);
                return Problem(detail: "That API key was not accepted. Copy it again from your dashboard at alttextgeneratorai.com.", statusCode: 400, title: "API key not accepted");
            }

            return new SettingsResponseModel { HasKey = true, CanEditKey = true, Credits = credits };
        }

        [HttpGet("images")]
        [ProducesResponseType<ImagesResponseModel>(StatusCodes.Status200OK)]
        public async Task<ImagesResponseModel> GetImages()
        {
            await _media.EnsurePropertyAsync();
            var items = _media.GetImages();

            return new ImagesResponseModel { Total = items.Count, Items = items };
        }

        [HttpPost("generate")]
        [ProducesResponseType<GenerateResponseModel>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<GenerateResponseModel>> Generate(GenerateRequestModel model, CancellationToken cancellationToken)
        {
            try
            {
                var dataUrl = await _media.GetImageDataUrlAsync(model.Key, cancellationToken);
                var language = string.IsNullOrWhiteSpace(model.Language) ? "english" : model.Language.Trim().ToLowerInvariant();
                var (altText, creditsLeft) = await _client.GenerateAsync(dataUrl, language, cancellationToken);

                return new GenerateResponseModel { AltText = altText, CreditsLeft = creditsLeft };
            }
            catch (AltTextException ex)
            {
                // A 401 here would be read by the backoffice as an expired editor session and sign them out,
                // so a problem with the API key is sent as a 400.
                var status = ex.StatusCode is 401 or 403 ? 400 : ex.StatusCode;
                return Problem(detail: ex.Message, statusCode: status, title: "Alt text could not be generated");
            }
        }

        [HttpPost("save")]
        [ProducesResponseType<SaveResponseModel>(StatusCodes.Status200OK)]
        public async Task<SaveResponseModel> Save(SaveRequestModel model)
        {
            await _media.EnsurePropertyAsync();

            return new SaveResponseModel { Saved = _media.Save(model.Items) };
        }
    }
}
