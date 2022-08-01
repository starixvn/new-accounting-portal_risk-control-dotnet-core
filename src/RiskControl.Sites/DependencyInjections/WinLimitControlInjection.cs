using MediatR;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.WinLossLimitControl.FileDownload;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.Monitor.Parser;
using RiskControl.WinLossLimitControl.Monitor.Unblock;
using RiskControl.WinLossLimitControl.PlayerSettings.Insert;
using RiskControl.WinLossLimitControl.Services;
using CurrencySettingUpdate = RiskControl.WinLossLimitControl.CurrencySettings.Update;
using Filter = RiskControl.WinLossLimitControl.Filter;
using GameRound = RiskControl.WinLossLimitControl.GameRound;
using PlayerSettingUpdate = RiskControl.WinLossLimitControl.PlayerSettings.Update;

namespace RiskControl.Sites.DependencyInjections
{
    public static class WinLimitControlInjection
    {
        public static void RegisterWinLimitControlServices(this IServiceCollection service)
        {
            service.AddMediatR(typeof(FilterHandler).Assembly);
            service.AddMediatR(typeof(BetLimitSettingUpdateHandler).Assembly);
            service.AddMediatR(typeof(BetLimitSettingQueryHandler).Assembly);
            service.AddMediatR(typeof(BetLimitMonitorQueryHandler).Assembly);
            service.AddMediatR(typeof(BetLimitMonitorQueryExcelHandler).Assembly);
            service.AddTransient<AuthorizationService, AuthorizationServiceImp>();
            service.AddTransient<IncreamentedSeriesContrainService, IncreamentedSeriesContrainServiceImp>();
            service.AddTransient<DataTransformService, DataTransformServiceImp>();
            service.AddTransient<UserHttpContext, UserHttpContextImp>();

            service.AddTransient<BaseEntityGroupLoaderService, BaseEntityGroupLoaderServiceImp>();
            service.AddTransient<FilterService, FilterServiceImp>();
            service.AddTransient<Filter.CacheRefService, Filter.CacheRefServiceImp>();

            service.AddTransient<CurrencySettingUpdate.UpdateService, CurrencySettingUpdate.UpdateServiceImp>();
            service.AddTransient<CurrencySettingUpdate.ValidationService, CurrencySettingUpdate.ValidationServiceImp>();

            service.AddTransient<InsertService, InsertServiceImp>();
            service.AddTransient<ValidationService, ValidationServiceImp>();

            service.AddTransient<PlayerSettingUpdate.ValidationService, PlayerSettingUpdate.ValidationServiceImp>();

            service.AddTransient<WinLimitSettingXmlParser, WinLimitSettingXmlParserImp>();

            service.AddTransient<UnblockMemberService, UnblockMemberServiceImp>();

            service.AddTransient<FileContentService, FileContentServiceImp>();

            service.AddTransient<GameRound.BetLimitMonitorDataService, GameRound.BetLimitMonitorDataServiceImp>();
        }
    }
}
