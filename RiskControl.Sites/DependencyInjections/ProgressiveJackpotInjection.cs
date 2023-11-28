using Microsoft.Extensions.DependencyInjection;
using RiskControl.ProgressiveJackpot;

namespace RiskControl.Sites.DependencyInjections;

using WebApiClient;

public static class ProgressiveJackpotInjection
{
    public static void RegisterProgressiveJackpotService(this IServiceCollection service)
    {
        service.AddTransient<RichHttpClient, RichHttpClientImp>();
        service.AddTransient<ProgressiveApiClient, ProgressiveApiClientImp>();
        service.AddTransient<ExcelBuilder, ExcelBuilderImp>();
    }
}