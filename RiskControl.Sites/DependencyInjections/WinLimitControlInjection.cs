using Microsoft.Extensions.DependencyInjection;
using RiskControl.WinLossLimitControl.FileDownload;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.Services;
using PlayerSettings = RiskControl.WinLossLimitControl.PlayerSettings;
using CurrencySettings = RiskControl.WinLossLimitControl.CurrencySettings;
using Monitor = RiskControl.WinLossLimitControl.Monitor;

namespace RiskControl.Sites.DependencyInjections;

public static class WinLimitControlInjection
{
    public static void RegisterWinLimitControlServices(this IServiceCollection services)
    {
        services.AddTransient<AuthorizationService, AuthorizationServiceImp>();
        services.AddTransient<IncreamentedSeriesContrainService, IncreamentedSeriesContrainServiceImp>();
        services.AddTransient<DataTransformService, DataTransformServiceImp>();
        services.AddTransient<UserHttpContext, UserHttpContextImp>();

        services.AddTransient<BaseEntityGroupLoaderService, BaseEntityGroupLoaderServiceImp>();
        services.AddTransient<FilterService, FilterServiceImp>();
        services.AddTransient<CacheRefService, CacheRefServiceImp>();

        services.AddTransient<CurrencySettings.Update.UpdateService, CurrencySettings.Update.UpdateServiceImp>();
        services.AddTransient<CurrencySettings.Update.ValidationService, CurrencySettings.Update.ValidationServiceImp>();

        services.AddTransient<PlayerSettings.Insert.InsertService, PlayerSettings.Insert.InsertServiceImp>();
        services.AddTransient<PlayerSettings.Insert.ValidationService, PlayerSettings.Insert.ValidationServiceImp>();

        services.AddTransient<PlayerSettings.Update.ValidationService, PlayerSettings.Update.ValidationServiceImp>();

        services.AddTransient<Monitor.Parser.WinLimitSettingXmlParser, Monitor.Parser.WinLimitSettingXmlParserImp>();

        services.AddTransient<Monitor.Unblock.UnblockMemberService, Monitor.Unblock.UnblockMemberServiceImp>();

        services.AddTransient<FileContentService, FileContentServiceImp>();

        services.AddTransient<BetLimitMonitorDataService, BetLimitMonitorDataServiceImp>();
    }
}