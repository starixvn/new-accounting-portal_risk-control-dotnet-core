using Microsoft.Extensions.DependencyInjection;
using RiskControl.BettingMonitoring.Query;
using RiskControl.BettingMonitoring.Update;

namespace RiskControl.Sites.DependencyInjections
{
    public static class BetMonitoringInjection
    {
        public static void RegisterBetMonitoringServices(this IServiceCollection service)
        {
            service.AddTransient<QueryService, QueryServiceImp>();
            service.AddTransient<UpdateService, UpdateServiceImp>();
        }
    }
}
