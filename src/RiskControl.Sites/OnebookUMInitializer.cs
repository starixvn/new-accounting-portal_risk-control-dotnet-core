using Fanex.Caching;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ONEbook.UM;
using ONEbook.UM.AspNetCore;
using ONEbook.UM.AspNetCore.Filters;
using ONEbook.UM.Configurations;
using ONEbook.UM.Helpers;
using ONEbook.UM.Services;
using ONEbook.UM.Transport;

namespace RiskControl.Sites
{
    public static class OnebookUMInitializer
    {
        private static UMClientConfiguration umConfig;
        public static void InitializeUMClientManager()
        {
            UMClientManager
              .UseConfig(umConfig)
              .UseCacheService(new UMCacheService(new CacheService()))
              .UseRestClient(new UMRestClient(umConfig))
              .UseHttpContext(new HttpContextHelper());
        }

        public static void RegisterServiceCollection(IServiceCollection services, IConfiguration configuration)
        {
            umConfig = new UMClientConfiguration();
            services.AddSingleton(umConfig.Initialize(configuration));
            services.AddSingleton<CheckUMFilterAttribute>();
            services.AddSingleton<IUMCacheService, UMCacheService>();
            services.AddSingleton<IUMRestClient, UMRestClient>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>(); 
            services.AddSingleton<IHttpContextHelper, HttpContextHelper>();
            services.AddSingleton<IMaintenanceService, MaintenanceService>();

        }
    }

    public class HttpContextHelper : IHttpContextHelper
    {
        public string GetSession(string key)
        {
            return string.Empty;
        }

        public string GetValueFromQueryString(string queryKey)
        {
            return string.Empty;
        }

        public void SetSession(string key, string value)
        {
            // Method intentionally left empty.
        }
    }
}
