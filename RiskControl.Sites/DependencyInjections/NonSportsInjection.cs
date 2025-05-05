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
using Headline = RiskControl.NonSportsGamesStatistics.Headline;

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
        service.RegisterHeadlineServices();
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
        services.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.Product.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.Product.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotal.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyViewGrandTotal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotal.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyGrandTotal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotal.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.ProductGrandTotal.QueryModel>>();
        services.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.Company.Criteria>,
            DailyViewGroupStatistics.CompanyServiceImp<DailyViewGroupStatistics.Company.Criteria>>();
        services.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.Device.Criteria>,
            DailyViewGroupStatistics.DeviceServiceImp<DailyViewGroupStatistics.Device.Criteria>>();
        services.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.Company.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.Company.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.Device.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.Device.QueryModel>>();
        services.AddTransient<SortingService<DailyViewGroupStatisticWithTotalReportModel>, DailyViewGroupStatistics.SortingServiceImp>();
        services.AddTransient<DailyViewCommon.GridOptionHeaderBuilderService, DailyViewCommon.GridOptionHeaderBuilderServiceImp>();
        services.AddTransient<DailyViewCommon.GridOptionDataRowBuilderService, DailyViewCommon.GridOptionDataRowBuilderServiceImp>();
        services.AddTransient<SortingService<DailyReportModel>, DailyViewDaily.SortingServiceImp>();
        services.AddTransient<GridOptionBuilderService<DailyReportModel, DailyViewDaily.QueryModel>,
            DailyViewDaily.GridOptionBuilderServiceImp<DailyViewDaily.QueryModel>>();
        services.AddTransient<Service<DailyReportModel, DailyViewDaily.Criteria>, DailyViewDaily.ServiceImp<DailyViewDaily.Criteria>>();
        services.AddTransient<Service<DailyViewReportModel, DailyView.Criteria>, DailyView.ServiceImp<DailyView.Criteria>>();
        services.AddTransient<Service<DailyViewReportModel, DailyView.Product.Criteria>, DailyView.ServiceImp<DailyView.Product.Criteria>>();
        services.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotal.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyGrandTotal.Criteria>>();
        services.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotal.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyViewGrandTotal.Criteria>>();
        services.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotal.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.ProductGrandTotal.Criteria>>();
    }
    
    private static void RegisterUserNameViewServices(this IServiceCollection services)
    {
        services.AddTransient<UserNameViewCommon.GridOptionHeaderBuilderService, UserNameViewCommon.GridOptionHeaderBuilderServiceImp>();
        services.AddTransient<UserNameViewCommon.GridOptionDataRowBuilderService, UserNameViewCommon.GridOptionDataRowBuilderServiceImp>();
        services.AddTransient<Service<UserNameViewReportModel, UserNameViewMain.Criteria>, UserNameViewMain.ServiceImp<UserNameViewMain.Criteria>>();
        services.AddTransient<SortingService<UserNameViewReportModel>, UserNameViewMain.SortingServiceImp>();
        services.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.AssociatedAccount.QueryModel>,
            UserNameView.AssociatedAccount.GridOptionBuilderServiceImp<UserNameView.AssociatedAccount.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.GrandTotal.QueryModel>,
            UserNameView.GrandTotal.GridOptionBuilderServiceImp<UserNameView.GrandTotal.QueryModel>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameViewMain.QueryModel>,
            UserNameViewMain.GridOptionBuilderServiceImp<UserNameViewMain.QueryModel>>();
        services.AddTransient<Service<UserNameViewReportModel, UserNameView.GrandTotal.Criteria>,
            UserNameView.GrandTotal.ServiceImp<UserNameView.GrandTotal.Criteria>>();
        services.AddTransient<Service<UserNameViewReportModel, UserNameView.AssociatedAccount.Criteria>,
            UserNameView.AssociatedAccount.ServiceImp<UserNameView.AssociatedAccount.Criteria>>();
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
        services.AddTransient<Service<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.Criteria>, TopTwentyMain.ServiceImp<TopTwentyMain.Criteria>>();
        services.AddTransient<GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.QueryModel>,
            TopTwentyMain.GridOptionBuilderServiceImp<TopTwentyMain.QueryModel>>();
        services.AddTransient<Service<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.Criteria>,
            TopTwentyGroupStatistics.ServiceImp<TopTwentyGroupStatistics.Criteria>>();
        services.AddTransient<GridOptionBuilderService<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.QueryModel>,
            TopTwentyGroupStatistics.GridOptionBuilderServiceImp<TopTwentyGroupStatistics.QueryModel>>();
    }

    private static void RegisterHourlyServices(this IServiceCollection services)
    {
        services.AddTransient<Hourly.Service, Hourly.ServiceImp>();
        services.AddTransient<Hourly.ExcelReportBuilder, Hourly.ExcelReportBuilderImp>();
    }

    private static void RegisterHeadlineServices(this IServiceCollection services)
    {
        services.AddTransient<Headline.GridOptionBuilderService, Headline.GridOptionBuilderServiceImp>();
        services.AddTransient<Headline.Service, Headline.ServiceImp>();
    }
}