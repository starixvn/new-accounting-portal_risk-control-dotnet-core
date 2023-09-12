using Microsoft.Extensions.DependencyInjection;
using RiskControl.BettingMonitoring.Query;
using RiskControl.BettingMonitoring.Update;

namespace RiskControl.Sites.DependencyInjections;

public static class BetMonitoringInjection
{
    public static void RegisterBetMonitoringServices(this IServiceCollection services)
    {
        services.AddTransient<QueryService, QueryServiceImp>();
        services.AddTransient<UpdateService, UpdateServiceImp>();
    }
}