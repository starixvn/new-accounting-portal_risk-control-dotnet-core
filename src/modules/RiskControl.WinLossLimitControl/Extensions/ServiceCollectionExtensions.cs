using Microsoft.Extensions.DependencyInjection;
using Olympus.DotNetCore.WebApiClient;

namespace RiskControl.WinLossLimitControl.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddWinLossLimitControlModule(this IServiceCollection services)
        {
            services.AddSingleton<RichHttpClient, RichHttpClientImp>();
        }
    }
}