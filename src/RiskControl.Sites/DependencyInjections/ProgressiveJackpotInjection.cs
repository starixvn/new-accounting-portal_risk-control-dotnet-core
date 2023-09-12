using Microsoft.Extensions.DependencyInjection;
using Olympus.WebApiClient;
using RiskControl.ProgressiveJackpot;

namespace RiskControl.Sites.DependencyInjections;

public static class ProgressiveJackpotInjection
{
    public static void RegisterProgressiveJackpotService(this IServiceCollection service)
    {
        service.AddTransient<RichHttpClient, RichHttpClientImp>();
        service.AddTransient<ProgressiveApiClient, ProgressiveApiClientImp>();
        service.AddTransient<ExcelBuilder, ExcelBuilderImp>();
    }
}