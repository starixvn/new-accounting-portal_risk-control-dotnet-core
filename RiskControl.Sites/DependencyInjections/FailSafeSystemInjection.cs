using Microsoft.Extensions.DependencyInjection;
using RiskControl.FailSafeSystem.Service;

namespace RiskControl.Sites.DependencyInjections;

public static class FailSafeSystemInjection
{
    public static void RegisterFailSafeSystemServices(this IServiceCollection services)
    {
        services.AddTransient<FailSafeSystemService, FailSafeSystemServiceImp>();
    }
}