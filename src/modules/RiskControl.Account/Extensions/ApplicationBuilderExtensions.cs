using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Olympus.DotNetCore.NapApiClient.Configuration;

namespace RiskControl.Account.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static void ConfigureAccountModule(this IApplicationBuilder application)
        {
            using (var serviceScope = application.ApplicationServices.CreateScope())
            {
                var napApiOptions = serviceScope.ServiceProvider.GetService<IOptions<NapApiOptions>>();
                NapApiConfiguration.Configure(napApiOptions.Value);
            }
        }
    }
}