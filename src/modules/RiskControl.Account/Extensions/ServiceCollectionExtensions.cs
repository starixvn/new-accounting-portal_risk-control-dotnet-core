using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Olympus.DotNetCore.Authentication;
using Olympus.DotNetCore.NapApiClient.Configuration;
using Olympus.DotNetCore.NapApiClient.Service;
using RiskControl.Account.Models;
using RiskControl.Account.Services;
using Microsoft.Extensions.Options;

namespace RiskControl.Account.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddAccountModule(this IServiceCollection services)
        {
            services.AddSingleton<UserService, UserServiceImp>();
            services.AddSingleton<GroupService, GroupServiceImp>();
            services.AddSingleton<SecurityService, SecurityServiceImp>();
            services.AddSingleton<CurrentContextService, CurrentContextServiceImp>();
            services.AddSingleton<StateService, StateServiceImp>();
            services.AddSingleton<TokenGenerator, TokenGeneratorImp>();
            services.AddScoped<IHttpContextAccessor, HttpContextAccessor>();
        }
    }
}