using Fanex.Caching;
using Fanex.Caching.Memory;
using Fanex.Data.Repository;
using Fanex.RemotingRef;
using Microsoft.Extensions.DependencyInjection;
using Olympus.FPSAPI.Client;
using RiskControl.AssociatedAcccount;
using RiskControl.BalanceUp;
using RiskControl.Configuration;
using RiskControl.Services;

namespace RiskControl.Sites.DependencyInjections;

public static class GlobalInjection
{
    public static void RegisterGlobalServices(this IServiceCollection service)
    {
        service.AddTransient<IRemotingRefService, RemotingRefService>();
        service.AddSingleton<ICache>(_ => new MemoryCache(new MemoryCacheOptions()));

        service.AddTransient<IDynamicRepository, DynamicRepository>();

        service.AddTransient<ConfigurationService, ConfigurationServiceImp>();
        service.AddTransient<BalanceUpService, BalanceUpServiceImp>();
        service.AddTransient<LogDataService, LogDataServiceImp>();

        service.AddTransient<FraudServiceWrapper, FraudServiceWrapperImp>();
        service.AddTransient<AssociatedAccountService, AssociatedAccountServiceImp>();
        service.AddTransient<CustomerTrackingSystemApiService, CustomerTrackingSystemApiServiceImp>();
        service.AddSingleton<ICacheService>(new CacheService());
    }
}