using Asp.Versioning;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Api.Management.OpenApi;
using Umbraco.Cms.Api.Common.OpenApi;
using AltTextGeneratorAI.Umbraco.Services;

namespace AltTextGeneratorAI.Umbraco.Composers
{
    public class AltTextGeneratorAIUmbracoApiComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {

            builder.Services.AddSingleton<IOperationIdHandler, CustomOperationHandler>();

            builder.Services.AddSingleton<AltTextSettings>();
            builder.Services.AddSingleton<MediaAltTextService>();
            builder.Services.AddHttpClient<AltTextClient>(client => client.Timeout = TimeSpan.FromSeconds(60));

            builder.Services.Configure<SwaggerGenOptions>(opt =>
            {
                // Related documentation:
                // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api
                // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api/adding-a-custom-swagger-document
                // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api/versioning-your-api
                // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api/access-policies

                // Configure the Swagger generation options
                // Add in a new Swagger API document solely for our own package that can be browsed via Swagger UI
                // Along with having a generated swagger JSON file that we can use to auto generate a TypeScript client
                opt.SwaggerDoc(Constants.ApiName, new OpenApiInfo
                {
                    Title = "Alt Text Generator AI Backoffice API",
                    Version = "1.0",
                    // Contact = new OpenApiContact
                    // {
                    //     Name = "Some Developer",
                    //     Email = "you@company.com",
                    //     Url = new Uri("https://company.com")
                    // }
                });

                // Enable Umbraco authentication for the "Example" Swagger document
                // PR: https://github.com/umbraco/Umbraco-CMS/pull/15699
                opt.OperationFilter<AltTextGeneratorAIUmbracoOperationSecurityFilter>();
            });
        }

        public class AltTextGeneratorAIUmbracoOperationSecurityFilter : BackOfficeSecurityRequirementsOperationFilterBase
        {
            protected override string ApiName => Constants.ApiName;
        }

        // Gives the operations of our own controllers the same operation IDs as the Management API, such as GetWhoAmI,
        // so the generated TypeScript client gets readable function names
        // https://docs.umbraco.com/umbraco-cms/tutorials/creating-a-backoffice-api/umbraco-schema-and-operation-ids#operation-ids
        public class CustomOperationHandler : OperationIdHandler
        {
            public CustomOperationHandler(IOptions<ApiVersioningOptions> apiVersioningOptions) : base(apiVersioningOptions)
            {
            }

            protected override bool CanHandle(ApiDescription apiDescription, ControllerActionDescriptor controllerActionDescriptor)
            {
                return controllerActionDescriptor.ControllerTypeInfo.Namespace?.StartsWith("AltTextGeneratorAI.Umbraco.Controllers", comparisonType: StringComparison.InvariantCultureIgnoreCase) is true;
            }
        }
    }
}
