using Fanex.Caching;
using Fanex.Caching.Memory;
using Fanex.Data.Repository;
using Fanex.NAP.Client.AspNetCore.Configuration;
using Fanex.NAP.Client.AspNetCore.Session;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Services;
using Fanex.RemotingRef;
using Microsoft.Extensions.DependencyInjection;
using Olympus.FPSAPI.Client;
using RiskControl.Core.AssociatedAcccount;
using RiskControl.Core.BalanceUp;
using RiskControl.Core.Configuration;

namespace RiskControl.Sites.DependencyInjections
{
    public static class GlobalInjection
    {
        public static void RegisterGlobalServices(this IServiceCollection service)
        {
            service.AddTransient<IRemotingRefService, RemotingRefService>();
            service.AddTransient<IUserService, UserService>();
            service.AddTransient<IGroupService, GroupService>();
            service.AddTransient<ISiteService, SiteService>();
            service.AddTransient<ISecurityService, SecurityService>();
            service.AddTransient<INapSession, NapSession>();
            service.AddTransient<INapSettings, NapSettings>();
            service.AddSingleton<ICache>(_ => new MemoryCache(new MemoryCacheOptions()));

            service.AddTransient<IDynamicRepository, DynamicRepository>();

            service.AddTransient<ConfigurationService, ConfigurationServiceImp>();
            service.AddTransient<BalanceUpService, BalanceUpServiceImp>();

            service.AddTransient<FraudServiceWrapper, FraudServiceWrapperImp>();
            service.AddTransient<AssociatedAccountService, AssociatedAccountServiceImp>();
            service.AddSingleton<ICacheService>(new CacheService());
        }
    }
}
