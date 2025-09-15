using Microsoft.Extensions.DependencyInjection;
using RiskControl.SabaPinGoal.Service;

namespace RiskControl.Sites.DependencyInjections;

public static class SabaPinGoalInjection
{
    public static void RegisterSabaPinGoalServices(this IServiceCollection services)
    {

        services.AddTransient<FilterService, FilterServiceImp>();
    }
}