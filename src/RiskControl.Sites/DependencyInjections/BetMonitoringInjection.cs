using MediatR;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.BettingMonitoring.Query;
using RiskControl.BettingMonitoring.Update;
using Query = RiskControl.BettingMonitoring.Query;
using Update = RiskControl.BettingMonitoring.Update;

namespace RiskControl.Sites.DependencyInjections
{
    public static class BetMonitoringInjection
    {
        public static void RegisterBetMonitoringServices(this IServiceCollection service)
        {
            service.AddMediatR(typeof(Query.Handler).Assembly);
            service.AddMediatR(typeof(Update.Handler).Assembly);
            service.AddTransient<QueryService, QueryServiceImp>();
            service.AddTransient<UpdateService, UpdateServiceImp>();
        }
    }
}
