using MediatR;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.WinLossLimitControl.FileDownload;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.Services;
using PlayerSettings = RiskControl.WinLossLimitControl.PlayerSettings;
using ManagedSettingGroup = RiskControl.WinLossLimitControl.ManagedSettingGroup;
using CurrencySettings = RiskControl.WinLossLimitControl.CurrencySettings;
using Monitor = RiskControl.WinLossLimitControl.Monitor;

namespace RiskControl.Sites.DependencyInjections;

public static class WinLimitControlInjection
{
    public static void RegisterWinLimitControlServices(this IServiceCollection service)
    {
        service.AddMediatR(typeof(FilterHandler).Assembly);
        service.AddMediatR(typeof(BetLimitSettingUpdateHandler).Assembly);
        service.AddMediatR(typeof(BetLimitSettingQueryHandler).Assembly);
        service.AddMediatR(typeof(BetLimitMonitorQueryHandler).Assembly);
        service.AddMediatR(typeof(BetLimitMonitorQueryExcelHandler).Assembly);
        service.AddMediatR(typeof(ManagedSettingGroup.Search.Handler).Assembly);
        service.AddMediatR(typeof(ManagedSettingGroup.Update.Handler).Assembly);
        service.AddMediatR(typeof(CurrencySettings.Search.Handler).Assembly);
        service.AddMediatR(typeof(CurrencySettings.Update.Handler).Assembly);
        service.AddMediatR(typeof(CurrencySettings.Update.UpdateInactiveSiteHandler).Assembly);
        service.AddMediatR(typeof(PlayerSettings.Search.Handler).Assembly);
        service.AddMediatR(typeof(PlayerSettings.Insert.Handler).Assembly);
        service.AddMediatR(typeof(PlayerSettings.Update.Handler).Assembly);
        service.AddMediatR(typeof(PlayerSettings.SearchForInserting.HandlerSearch).Assembly);
        service.AddMediatR(typeof(PlayerSettings.SearchForInserting.HandlerValidation).Assembly);
        service.AddMediatR(typeof(PlayerSettings.Delete.Handler).Assembly);
        service.AddMediatR(typeof(Monitor.Account.Handler).Assembly);
        service.AddMediatR(typeof(Monitor.History.Handler).Assembly);
        service.AddMediatR(typeof(Monitor.History.HandlerUncheckedNotification).Assembly);
        service.AddMediatR(typeof(Monitor.Search.Handler).Assembly);
        service.AddMediatR(typeof(Monitor.Unblock.HandlerUnblockPlaceBet).Assembly);
        service.AddMediatR(typeof(Monitor.Unblock.HandlerUnblockTransfer).Assembly);
        service.AddTransient<AuthorizationService, AuthorizationServiceImp>();
        service.AddTransient<IncreamentedSeriesContrainService, IncreamentedSeriesContrainServiceImp>();
        service.AddTransient<DataTransformService, DataTransformServiceImp>();
        service.AddTransient<UserHttpContext, UserHttpContextImp>();

        service.AddTransient<BaseEntityGroupLoaderService, BaseEntityGroupLoaderServiceImp>();
        service.AddTransient<FilterService, FilterServiceImp>();
        service.AddTransient<CacheRefService, CacheRefServiceImp>();

        service.AddTransient<CurrencySettings.Update.UpdateService, CurrencySettings.Update.UpdateServiceImp>();
        service.AddTransient<CurrencySettings.Update.ValidationService, CurrencySettings.Update.ValidationServiceImp>();

        service.AddTransient<PlayerSettings.Insert.InsertService, PlayerSettings.Insert.InsertServiceImp>();
        service.AddTransient<PlayerSettings.Insert.ValidationService, PlayerSettings.Insert.ValidationServiceImp>();

        service.AddTransient<PlayerSettings.Update.ValidationService, PlayerSettings.Update.ValidationServiceImp>();

        service.AddTransient<Monitor.Parser.WinLimitSettingXmlParser, Monitor.Parser.WinLimitSettingXmlParserImp>();

        service.AddTransient<Monitor.Unblock.UnblockMemberService, Monitor.Unblock.UnblockMemberServiceImp>();

        service.AddTransient<FileContentService, FileContentServiceImp>();

        service.AddTransient<BetLimitMonitorDataService, BetLimitMonitorDataServiceImp>();
    }
}