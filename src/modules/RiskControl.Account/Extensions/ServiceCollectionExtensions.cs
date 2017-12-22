using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Olympus.DotNetCore.Authentication;
using Olympus.DotNetCore.Maintenance;
using Olympus.DotNetCore.NapApiClient.Configuration;
using Olympus.DotNetCore.NapApiClient.Service;
using RiskControl.Account.Models;
using RiskControl.Account.Services;

namespace RiskControl.Account.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddAccountModule(this IServiceCollection services)
        {
            services.AddScoped<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped<UserService, UserServiceImp>();
            services.AddScoped<GroupService, GroupServiceImp>();
            services.AddScoped<SecurityService, SecurityServiceImp>();
            services.AddScoped<CurrentContextService, CurrentContextServiceImp>();
            services.AddScoped<StateService, StateServiceImp>();
            services.AddScoped<TokenGenerator, TokenGeneratorImp>();            

            services.AddScoped<MaintenanceServiceFactory, MaintenanceServiceFactoryImp>();            
        }
    }
}