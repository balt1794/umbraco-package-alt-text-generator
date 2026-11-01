using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Umbraco.Cms.Api.Common.Attributes;
using Umbraco.Cms.Api.Common.Filters;
using Umbraco.Cms.Web.Common.Authorization;
using Umbraco.Cms.Web.Common.Routing;

namespace AltTextGeneratorAI.Umbraco.Controllers
{
    [ApiController]
    [BackOfficeRoute("alttextgeneratorai/api/v{version:apiVersion}")]
    [Authorize(Policy = AuthorizationPolicies.SectionAccessMedia)]
    [MapToApi(Constants.ApiName)]
    [JsonOptionsName(global::Umbraco.Cms.Core.Constants.JsonOptionsNames.BackOffice)]
    public class AltTextGeneratorAIApiControllerBase : ControllerBase
    {
    }
}
