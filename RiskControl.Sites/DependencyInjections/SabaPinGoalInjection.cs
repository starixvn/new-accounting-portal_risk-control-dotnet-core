using Microsoft.Extensions.DependencyInjection;
using RiskControl.SabaPinGoal.Service;

namespace RiskControl.Sites.DependencyInjections;

public static class SabaPinGoalInjection
{
    public static void RegisterSabaPinGoalServices(this IServiceCollection services)
    {
        services.AddTransient<DailyGridOptionBuilderService, DailyGridOptionBuilderServiceImp>();
        services.AddTransient<GridOptionDataRowBuilderService, GridOptionDataRowBuilderServiceImp>();
        services.AddTransient<GridOptionHeaderBuilderService, GridOptionHeaderBuilderServiceImp>();
        services.AddTransient<GridOptionRemoveColumnService, GridOptionRemoveColumnServiceImp>();
        services.AddTransient<SortingService, SortingServiceImp>();
        services.AddTransient<FilterService, FilterServiceImp>();
        services.AddTransient<DailyService, DailyServiceImp>();
    }
}