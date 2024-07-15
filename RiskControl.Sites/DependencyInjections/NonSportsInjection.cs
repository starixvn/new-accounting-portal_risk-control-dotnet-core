using Microsoft.Extensions.DependencyInjection;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Model;
using System.Collections.Generic;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Services;
using CurrencyViewCommon = RiskControl.NonSportsGamesStatistics.CurrencyView.Common;
using CurrencyViewGrandTotal = RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal;
using CurrencyViewMain = RiskControl.NonSportsGamesStatistics.CurrencyView.Main;
using DailyView = RiskControl.NonSportsGamesStatistics.DailyView.Main;
using DailyViewCommon = RiskControl.NonSportsGamesStatistics.DailyView.Common;
using DailyViewDaily = RiskControl.NonSportsGamesStatistics.DailyView.Daily;
using DailyViewGrandTotal = RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal;
using DailyViewGroupStatistics = RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;
using Hourly = RiskControl.NonSportsGamesStatistics.Hourly;
using TopTwentyCommon = RiskControl.NonSportsGamesStatistics.TopTwenty.Common;
using TopTwentyGroupStatistics = RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics;
using TopTwentyMain = RiskControl.NonSportsGamesStatistics.TopTwenty.Main;
using UserNameViewCommon = RiskControl.NonSportsGamesStatistics.UserNameView.Common;
using UserNameViewMain = RiskControl.NonSportsGamesStatistics.UserNameView.Main;
using UserNameView = RiskControl.NonSportsGamesStatistics.UserNameView;

namespace RiskControl.Sites.DependencyInjections;

public static class NonSportsInjection
{
    public static void RegisterNonSportsServices(this IServiceCollection service)
    {
        service.RegisterDailyViewServices();
        service.RegisterUserNameViewServices();
        service.RegisterCurrencyViewServices();
        service.RegisterTopTwentyServices();
        service.RegisterHourlyServices();
        service.AddTransient<RawService, RawServiceImp>();
        service.AddTransient<GridOptionRemoveColumnService, GridOptionRemoveColumnServiceImp>();
        service.AddTransient<DataSourceChooser, DataSourceChooserImp>();
        service.AddTransient<HeaderTextByReportService, HeaderTextByReportServiceImp>();
        service.AddTransient<GridOptionCustomExcelCellStyleService, GridOptionCustomExcelCellStyleServiceImp>();
        service.AddTransient<CalculationService, CalculationServiceImp>();
        service.AddTransient<FilterService, FilterServiceImp>();
        service.AddTransient<SavedFilterService, SavedFilterServiceImp>();
    }

    private static void RegisterDailyViewServices(this IServiceCollection services)
    {
        services.AddTransient<SortingService<DailyViewReportModel>, DailyView.SortingServiceImp>();
        services.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.History.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.History.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.Normal.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.Normal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.ProductHistory.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.ProductHistory.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.ProductNormal.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.ProductNormal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotalHistory.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyViewGrandTotalHistory.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotalNormal.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyViewGrandTotalNormal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotalHistory.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyGrandTotalHistory.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotalNormal.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyGrandTotalNormal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotalHistory.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.ProductGrandTotalHistory.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotalNormal.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.ProductGrandTotalNormal.QueryModel>>();
        services.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.CompanyHistory.Criteria>,
            DailyViewGroupStatistics.CompanyServiceImp<DailyViewGroupStatistics.CompanyHistory.Criteria>>();
        services.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.CompanyNormal.Criteria>,
            DailyViewGroupStatistics.CompanyServiceImp<DailyViewGroupStatistics.CompanyNormal.Criteria>>();
        services.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.DeviceHistory.Criteria>,
            DailyViewGroupStatistics.DeviceServiceImp<DailyViewGroupStatistics.DeviceHistory.Criteria>>();
        services.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.DeviceNormal.Criteria>,
            DailyViewGroupStatistics.DeviceServiceImp<DailyViewGroupStatistics.DeviceNormal.Criteria>>();
        services.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.CompanyHistory.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.CompanyHistory.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.CompanyNormal.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.CompanyNormal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.DeviceHistory.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.DeviceHistory.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.DeviceNormal.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.DeviceNormal.QueryModel>>();
        services.AddTransient<SortingService<DailyViewGroupStatisticWithTotalReportModel>, DailyViewGroupStatistics.SortingServiceImp>();
        services.AddTransient<DailyViewCommon.GridOptionHeaderBuilderService, DailyViewCommon.GridOptionHeaderBuilderServiceImp>();
        services.AddTransient<DailyViewCommon.GridOptionDataRowBuilderService, DailyViewCommon.GridOptionDataRowBuilderServiceImp>();
        services.AddTransient<SortingService<DailyReportModel>, DailyViewDaily.SortingServiceImp>();
        services.AddTransient<GridOptionBuilderService<DailyReportModel, DailyViewDaily.History.QueryModel>,
            DailyViewDaily.GridOptionBuilderServiceImp<DailyViewDaily.History.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<DailyReportModel, DailyViewDaily.Normal.QueryModel>,
            DailyViewDaily.GridOptionBuilderServiceImp<DailyViewDaily.Normal.QueryModel>>();
        services.AddTransient<Service<DailyReportModel, DailyViewDaily.History.Criteria>, DailyViewDaily.ServiceImp<DailyViewDaily.History.Criteria>>();
        services.AddTransient<Service<DailyReportModel, DailyViewDaily.Normal.Criteria>, DailyViewDaily.ServiceImp<DailyViewDaily.Normal.Criteria>>();
        services.AddTransient<Service<DailyViewReportModel, DailyView.History.Criteria>, DailyView.ServiceImp<DailyView.History.Criteria>>();
        services.AddTransient<Service<DailyViewReportModel, DailyView.Normal.Criteria>, DailyView.ServiceImp<DailyView.Normal.Criteria>>();
        services.AddTransient<Service<DailyViewReportModel, DailyView.ProductHistory.Criteria>, DailyView.ServiceImp<DailyView.ProductHistory.Criteria>>();
        services.AddTransient<Service<DailyViewReportModel, DailyView.ProductNormal.Criteria>, DailyView.ServiceImp<DailyView.ProductNormal.Criteria>>();
        services.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotalHistory.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyGrandTotalHistory.Criteria>>();
        services.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotalNormal.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyGrandTotalNormal.Criteria>>();
        services.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotalHistory.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyViewGrandTotalHistory.Criteria>>();
        services.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotalNormal.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyViewGrandTotalNormal.Criteria>>();
        services.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotalHistory.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.ProductGrandTotalHistory.Criteria>>();
        services.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotalNormal.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.ProductGrandTotalNormal.Criteria>>();
    }
    
    private static void RegisterUserNameViewServices(this IServiceCollection services)
    {
        services.AddTransient<UserNameViewCommon.GridOptionHeaderBuilderService, UserNameViewCommon.GridOptionHeaderBuilderServiceImp>();
        services.AddTransient<UserNameViewCommon.GridOptionDataRowBuilderService, UserNameViewCommon.GridOptionDataRowBuilderServiceImp>();
        services.AddTransient<Service<UserNameViewReportModel, UserNameViewMain.History.Criteria>, UserNameViewMain.ServiceImp<UserNameViewMain.History.Criteria>>();
        services.AddTransient<Service<UserNameViewReportModel, UserNameViewMain.Normal.Criteria>, UserNameViewMain.ServiceImp<UserNameViewMain.Normal.Criteria>>();
        services.AddTransient<SortingService<UserNameViewReportModel>, UserNameViewMain.SortingServiceImp>();
        services.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.AssociatedAccount.History.QueryModel>,
            UserNameView.AssociatedAccount.GridOptionBuilderServiceImp<UserNameView.AssociatedAccount.History.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.AssociatedAccount.Normal.QueryModel>,
            UserNameView.AssociatedAccount.GridOptionBuilderServiceImp<UserNameView.AssociatedAccount.Normal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.GrandTotal.History.QueryModel>,
            UserNameView.GrandTotal.GridOptionBuilderServiceImp<UserNameView.GrandTotal.History.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.GrandTotal.Normal.QueryModel>,
            UserNameView.GrandTotal.GridOptionBuilderServiceImp<UserNameView.GrandTotal.Normal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameViewMain.History.QueryModel>,
            UserNameViewMain.GridOptionBuilderServiceImp<UserNameViewMain.History.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameViewMain.Normal.QueryModel>,
            UserNameViewMain.GridOptionBuilderServiceImp<UserNameViewMain.Normal.QueryModel>>();
        services.AddTransient<Service<UserNameViewReportModel, UserNameView.GrandTotal.History.Criteria>,
            UserNameView.GrandTotal.ServiceImp<UserNameView.GrandTotal.History.Criteria>>();
        services.AddTransient<Service<UserNameViewReportModel, UserNameView.GrandTotal.Normal.Criteria>,
            UserNameView.GrandTotal.ServiceImp<UserNameView.GrandTotal.Normal.Criteria>>();
        services.AddTransient<Service<UserNameViewReportModel, UserNameView.AssociatedAccount.History.Criteria>,
            UserNameView.AssociatedAccount.ServiceImp<UserNameView.AssociatedAccount.History.Criteria>>();
        services.AddTransient<Service<UserNameViewReportModel, UserNameView.AssociatedAccount.Normal.Criteria>,
            UserNameView.AssociatedAccount.ServiceImp<UserNameView.AssociatedAccount.Normal.Criteria>>();
        services.AddTransient<UserNameViewMain.ExcelReportBuilder, UserNameViewMain.ExcelReportBuilderImp>();
    }

    private static void RegisterCurrencyViewServices(this IServiceCollection services)
    {
        services.AddTransient<CurrencyViewCommon.GridOptionHeaderBuilderService, CurrencyViewCommon.GridOptionHeaderBuilderServiceImp>();
        services.AddTransient<CurrencyViewCommon.GridOptionDataRowBuilderService, CurrencyViewCommon.GridOptionDataRowBuilderServiceImp>();
        services.AddTransient<CurrencyViewMain.Service, CurrencyViewMain.ServiceImp>();
        services.AddTransient<CurrencyViewMain.GridOptionBuilderService, CurrencyViewMain.GridOptionBuilderServiceImp>();
        services.AddTransient<CurrencyViewMain.SortingService, CurrencyViewMain.SortingServiceImp>();
        services.AddTransient<CurrencyViewGrandTotal.Service, CurrencyViewGrandTotal.ServiceImp>();
        services.AddTransient<CurrencyViewGrandTotal.GridOptionBuilderService, CurrencyViewGrandTotal.GridOptionBuilderServiceImp>();
    }

    private static void RegisterTopTwentyServices(this IServiceCollection services)
    {
        services.AddTransient<TopTwentyCommon.GridOptionHeaderBuilderService, TopTwentyCommon.GridOptionHeaderBuilderServiceImp>();
        services.AddTransient<TopTwentyCommon.GridOptionDataRowBuilderService, TopTwentyCommon.GridOptionDataRowBuilderServiceImp>();
        services.AddTransient<Service<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.History.Criteria>, TopTwentyMain.ServiceImp<TopTwentyMain.History.Criteria>>();
        services.AddTransient<Service<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.Normal.Criteria>, TopTwentyMain.ServiceImp<TopTwentyMain.Normal.Criteria>>();
        services.AddTransient<GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.History.QueryModel>,
            TopTwentyMain.GridOptionBuilderServiceImp<TopTwentyMain.History.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.Normal.QueryModel>,
            TopTwentyMain.GridOptionBuilderServiceImp<TopTwentyMain.Normal.QueryModel>>();
        services.AddTransient<Service<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.History.Criteria>,
            TopTwentyGroupStatistics.ServiceImp<TopTwentyGroupStatistics.History.Criteria>>();
        services.AddTransient<Service<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.Normal.Criteria>,
            TopTwentyGroupStatistics.ServiceImp<TopTwentyGroupStatistics.Normal.Criteria>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.History.QueryModel>,
            TopTwentyGroupStatistics.GridOptionBuilderServiceImp<TopTwentyGroupStatistics.History.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.Normal.QueryModel>,
            TopTwentyGroupStatistics.GridOptionBuilderServiceImp<TopTwentyGroupStatistics.Normal.QueryModel>>();
    }

    private static void RegisterHourlyServices(this IServiceCollection services)
    {
        services.AddTransient<Hourly.Service, Hourly.ServiceImp>();
        services.AddTransient<Hourly.ExcelReportBuilder, Hourly.ExcelReportBuilderImp>();
    }
}