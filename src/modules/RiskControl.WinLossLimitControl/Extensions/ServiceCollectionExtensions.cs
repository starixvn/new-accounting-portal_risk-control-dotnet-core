using CurrencySettingUpdate = RiskControl.WinLossLimitControl.CurrencySettings.Update;
using Microsoft.Extensions.DependencyInjection;
using Olympus.DotNetCore.WebApiClient;
using PlayerSettingUpdate = RiskControl.WinLossLimitControl.PlayerSettings.Update;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Monitor.Account;
using RiskControl.WinLossLimitControl.Monitor.Parser;
using RiskControl.WinLossLimitControl.Monitor.Unblock;
using RiskControl.WinLossLimitControl.PlayerSettings.Insert;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddWinLossLimitControlModule(this IServiceCollection services)
        {
            services.AddSingleton<RichHttpClient, RichHttpClientImp>();
            services.AddScoped<AuthorizationService, AuthorizationServiceImp>();
            services.AddScoped<IncreamentedSeriesContrainService, IncreamentedSeriesContrainServiceImp>();
            services.AddScoped<DataTransformService, DataTransformServiceImp>();
            services.AddScoped<BaseEntityGroupLoaderService, BaseEntityGroupLoaderServiceImp>();
            services.AddScoped<FilterService, FilterServiceImp>();
            services.AddScoped<CacheRefService, CacheRefServiceImp>();

            services.AddScoped<CurrencySettingUpdate.UpdateService, CurrencySettingUpdate.UpdateServiceImp>();
            services.AddScoped<CurrencySettingUpdate.ValidationService, CurrencySettingUpdate.ValidationServiceImp>();

            services.AddScoped<InsertService, InsertServiceImp>();
            services.AddScoped<ValidationService, ValidationServiceImp>();

            services.AddScoped<PlayerSettingUpdate.ValidationService, PlayerSettingUpdate.ValidationServiceImp>();

            services.AddScoped<WinLimitSettingXmlParser, WinLimitSettingXmlParserImp>();

            services.AddScoped<UnblockMemberService, UnblockMemberServiceImp>();

            services.AddScoped<AssociatedCustomerByIPService, AssociatedCustomerByIPServiceImp>();
            services.AddScoped<AssociatedCustomerByDeviceService, AssociatedCustomerByDeviceServiceImp>();
        }
    }
}