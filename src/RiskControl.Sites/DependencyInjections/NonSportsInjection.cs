using MediatR;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Model;
using System.Collections.Generic;
using CurrencyViewCommon = RiskControl.NonSportsGamesStatistics.CurrencyView.Common;
using CurrencyViewGrandTotal = RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal;
using CurrencyViewMain = RiskControl.NonSportsGamesStatistics.CurrencyView.Main;
using DailyView = RiskControl.NonSportsGamesStatistics.DailyView.Main;
using DailyViewCommon = RiskControl.NonSportsGamesStatistics.DailyView.Common;
using DailyViewDaily = RiskControl.NonSportsGamesStatistics.DailyView.Daily;
using DailyViewGrandTotal = RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal;
using DailyViewGroupStatistics = RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;
using Hourly = RiskControl.NonSportsGamesStatistics.Hourly;
using SpecificMemberCommon = RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using TopTwentyCommon = RiskControl.NonSportsGamesStatistics.TopTwenty.Common;
using TopTwentyGroupStatistics = RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics;
using TopTwentyMain = RiskControl.NonSportsGamesStatistics.TopTwenty.Main;
using UserNameViewCommon = RiskControl.NonSportsGamesStatistics.UserNameView.Common;
using UserNameViewMain = RiskControl.NonSportsGamesStatistics.UserNameView.Main;
using DailyViewHandler = RiskControl.NonSportsGamesStatistics.DailyView.Daily;
using GrandTotal = RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal;
using GroupStatistics = RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics;
using SpecificMember = RiskControl.NonSportsGamesStatistics.SpecificMember;
using UserNameView = RiskControl.NonSportsGamesStatistics.UserNameView;

namespace RiskControl.Sites.DependencyInjections;

public static class NonSportsInjection
{
    public static void RegisterNonSportsServices(this IServiceCollection service)
    {
        service.RegisterDailyViewServices();
        service.RegisterSpecificMembers();
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
    }

    private static void RegisterDailyViewServices(this IServiceCollection service)
    {
        service.AddMediatR(typeof(DailyViewHandler.History.Handler).Assembly);
        service.AddMediatR(typeof(DailyViewHandler.Normal.Handler).Assembly);
        service.AddMediatR(typeof(GrandTotal.DailyViewGrandTotalHistory.Handler).Assembly);
        service.AddMediatR(typeof(GrandTotal.DailyViewGrandTotalNormal.Handler).Assembly);
        service.AddMediatR(typeof(DailyView.History.Handler).Assembly);
        service.AddMediatR(typeof(DailyView.Normal.Handler).Assembly);
        service.AddMediatR(typeof(DailyView.ProductHistory.Handler).Assembly);
        service.AddMediatR(typeof(DailyView.ProductNormal.Handler).Assembly);
        service.AddMediatR(typeof(GrandTotal.DailyGrandTotalHistory.Handler).Assembly);
        service.AddMediatR(typeof(GrandTotal.DailyGrandTotalNormal.Handler).Assembly);
        service.AddMediatR(typeof(GrandTotal.ProductGrandTotalHistory.Handler).Assembly);
        service.AddMediatR(typeof(GrandTotal.ProductGrandTotalNormal.Handler).Assembly);
        service.AddMediatR(typeof(GroupStatistics.CompanyHistory.Handler).Assembly);
        service.AddMediatR(typeof(GroupStatistics.CompanyNormal.Handler).Assembly);
        service.AddMediatR(typeof(GroupStatistics.DeviceHistory.Handler).Assembly);
        service.AddMediatR(typeof(GroupStatistics.DeviceNormal.Handler).Assembly);
        service.AddTransient<SortingService<DailyViewReportModel>, DailyView.SortingServiceImp>();
        service.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.History.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.History.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.Normal.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.Normal.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.ProductHistory.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.ProductHistory.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewReportModel, DailyView.ProductNormal.QueryModel>, DailyView.GridOptionBuilderServiceImp<DailyView.ProductNormal.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewReportModel, SpecificMember.CasinoProduct.QueryModel>,
            DailyView.GridOptionBuilderServiceImp<SpecificMember.CasinoProduct.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewReportModel, SpecificMember.Daily.QueryModel>, DailyView.GridOptionBuilderServiceImp<SpecificMember.Daily.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewReportModel, SpecificMember.Monthly.QueryModel>, DailyView.GridOptionBuilderServiceImp<SpecificMember.Monthly.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewReportModel, SpecificMember.Product.QueryModel>, DailyView.GridOptionBuilderServiceImp<SpecificMember.Product.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotalHistory.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyViewGrandTotalHistory.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotalNormal.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyViewGrandTotalNormal.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotalHistory.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyGrandTotalHistory.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotalNormal.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.DailyGrandTotalNormal.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotalHistory.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.ProductGrandTotalHistory.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotalNormal.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<DailyViewGrandTotal.ProductGrandTotalNormal.QueryModel>>();
        service.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.CompanyHistory.Criteria>,
            DailyViewGroupStatistics.CompanyServiceImp<DailyViewGroupStatistics.CompanyHistory.Criteria>>();
        service.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.CompanyNormal.Criteria>,
            DailyViewGroupStatistics.CompanyServiceImp<DailyViewGroupStatistics.CompanyNormal.Criteria>>();
        service.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.DeviceHistory.Criteria>,
            DailyViewGroupStatistics.DeviceServiceImp<DailyViewGroupStatistics.DeviceHistory.Criteria>>();
        service.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.DeviceNormal.Criteria>,
            DailyViewGroupStatistics.DeviceServiceImp<DailyViewGroupStatistics.DeviceNormal.Criteria>>();
        service.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.CompanyHistory.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.CompanyHistory.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.CompanyNormal.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.CompanyNormal.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.DeviceHistory.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.DeviceHistory.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel, DailyViewGroupStatistics.DeviceNormal.QueryModel>,
            DailyViewGroupStatistics.GridOptionBuilderServiceImp<DailyViewGroupStatistics.DeviceNormal.QueryModel>>();
        service.AddTransient<SortingService<DailyViewGroupStatisticWithTotalReportModel>, DailyViewGroupStatistics.SortingServiceImp>();
        service.AddTransient<DailyViewCommon.GridOptionHeaderBuilderService, DailyViewCommon.GridOptionHeaderBuilderServiceImp>();
        service.AddTransient<DailyViewCommon.GridOptionDataRowBuilderService, DailyViewCommon.GridOptionDataRowBuilderServiceImp>();
        service.AddTransient<SortingService<DailyReportModel>, DailyViewDaily.SortingServiceImp>();
        service.AddTransient<GridOptionBuilderService<DailyReportModel, DailyViewDaily.History.QueryModel>,
            DailyViewDaily.GridOptionBuilderServiceImp<DailyViewDaily.History.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<DailyReportModel, DailyViewDaily.Normal.QueryModel>,
            DailyViewDaily.GridOptionBuilderServiceImp<DailyViewDaily.Normal.QueryModel>>();
        service.AddTransient<Service<DailyReportModel, DailyViewDaily.History.Criteria>, DailyViewDaily.ServiceImp<DailyViewDaily.History.Criteria>>();
        service.AddTransient<Service<DailyReportModel, DailyViewDaily.Normal.Criteria>, DailyViewDaily.ServiceImp<DailyViewDaily.Normal.Criteria>>();
        service.AddTransient<Service<DailyViewReportModel, DailyView.History.Criteria>, DailyView.ServiceImp<DailyView.History.Criteria>>();
        service.AddTransient<Service<DailyViewReportModel, DailyView.Normal.Criteria>, DailyView.ServiceImp<DailyView.Normal.Criteria>>();
        service.AddTransient<Service<DailyViewReportModel, DailyView.ProductHistory.Criteria>, DailyView.ServiceImp<DailyView.ProductHistory.Criteria>>();
        service.AddTransient<Service<DailyViewReportModel, DailyView.ProductNormal.Criteria>, DailyView.ServiceImp<DailyView.ProductNormal.Criteria>>();
        service.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotalHistory.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyGrandTotalHistory.Criteria>>();
        service.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyGrandTotalNormal.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyGrandTotalNormal.Criteria>>();
        service.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotalHistory.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyViewGrandTotalHistory.Criteria>>();
        service.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.DailyViewGrandTotalNormal.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.DailyViewGrandTotalNormal.Criteria>>();
        service.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotalHistory.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.ProductGrandTotalHistory.Criteria>>();
        service.AddTransient<Service<CurrencyViewStatisticsReportModel, DailyViewGrandTotal.ProductGrandTotalNormal.Criteria>,
            DailyViewGrandTotal.ServiceImp<DailyViewGrandTotal.ProductGrandTotalNormal.Criteria>>();
    }

    private static void RegisterSpecificMembers(this IServiceCollection service)
    {
        service.AddMediatR(typeof(SpecificMember.AssociatedAccount.Handler).Assembly);
        service.AddMediatR(typeof(SpecificMember.CasinoProduct.Handler).Assembly);
        service.AddMediatR(typeof(SpecificMember.Daily.Handler).Assembly);
        service.AddMediatR(typeof(SpecificMember.GrandTotal.Daily.Handler).Assembly);
        service.AddMediatR(typeof(SpecificMember.GrandTotal.CasinoProduct.Handler).Assembly);
        service.AddMediatR(typeof(SpecificMember.GrandTotal.Product.Handler).Assembly);
        service.AddMediatR(typeof(SpecificMember.Monthly.Handler).Assembly);
        service.AddMediatR(typeof(SpecificMember.Product.Handler).Assembly);
        service.AddMediatR(typeof(SpecificMember.Username.Handler).Assembly);

        service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, SpecificMember.GrandTotal.CasinoProduct.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<SpecificMember.GrandTotal.CasinoProduct.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, SpecificMember.GrandTotal.Daily.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<SpecificMember.GrandTotal.Daily.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel, SpecificMember.GrandTotal.Product.QueryModel>,
            DailyViewGrandTotal.GridOptionBuilderServiceImp<SpecificMember.GrandTotal.Product.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<UserNameViewReportModel, SpecificMember.AssociatedAccount.QueryModel>,
            UserNameView.AssociatedAccount.GridOptionBuilderServiceImp<SpecificMember.AssociatedAccount.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<UserNameViewReportModel, SpecificMember.Username.QueryModel>,
            UserNameViewMain.GridOptionBuilderServiceImp<SpecificMember.Username.QueryModel>>();
        service.AddTransient<Service<UserNameViewReportModel, SpecificMember.Common.UsernameHistoryCriteria>,
            SpecificMember.Username.ServiceImp<SpecificMember.Common.UsernameHistoryCriteria>>();
        service.AddTransient<Service<DailyViewReportModel, SpecificMember.Daily.HistoryCriteria>, SpecificMember.Daily.ServiceImp<SpecificMember.Daily.HistoryCriteria>>();
        service.AddTransient<Service<DailyViewReportModel, SpecificMember.Product.HistoryCriteria>, SpecificMember.Product.ServiceImp<SpecificMember.Product.HistoryCriteria>>();
        service.AddTransient<SpecificMemberCommon.UsernameService, SpecificMemberCommon.UsernameServiceImp>();
        service.AddTransient<Service<UserNameViewReportModel, SpecificMember.AssociatedAccount.Criteria>,
            SpecificMember.AssociatedAccount.ServiceImp<SpecificMember.AssociatedAccount.Criteria>>();
        service.AddTransient<SpecificMemberCommon.DailyService, SpecificMemberCommon.DailyServiceImp>();
        service.AddTransient<Service<DailyViewReportModel, SpecificMember.CasinoProduct.HistoryCriteria>,
            SpecificMember.CasinoProduct.ServiceImp<SpecificMember.CasinoProduct.HistoryCriteria>>();
        service.AddTransient<Service<DailyViewReportModel, SpecificMember.Monthly.HistoryCriteria>,
            SpecificMember.Monthly.ServiceImp<SpecificMember.Monthly.HistoryCriteria>>();
        service.AddTransient<Service<CurrencyViewStatisticsReportModel, SpecificMember.GrandTotal.CasinoProduct.HistoryCriteria>,
            SpecificMember.GrandTotal.CasinoProduct.ServiceImp<SpecificMember.GrandTotal.CasinoProduct.HistoryCriteria>>();
        service.AddTransient<Service<CurrencyViewStatisticsReportModel, SpecificMember.GrandTotal.Daily.HistoryCriteria>,
            SpecificMember.GrandTotal.Daily.ServiceImp<SpecificMember.GrandTotal.Daily.HistoryCriteria>>();
        service.AddTransient<Service<CurrencyViewStatisticsReportModel, SpecificMember.GrandTotal.Product.HistoryCriteria>,
            SpecificMember.GrandTotal.Product.ServiceImp<SpecificMember.GrandTotal.Product.HistoryCriteria>>();
        service.AddTransient<SpecificMemberCommon.GrandTotalService, SpecificMemberCommon.GrandTotalServiceImp>();
    }

    private static void RegisterUserNameViewServices(this IServiceCollection service)
    {
        service.AddMediatR(typeof(UserNameView.AssociatedAccount.Normal.Handler).Assembly);
        service.AddMediatR(typeof(UserNameView.AssociatedAccount.History.Handler).Assembly);
        service.AddMediatR(typeof(UserNameView.GrandTotal.History.Handler).Assembly);
        service.AddMediatR(typeof(UserNameView.GrandTotal.Normal.Handler).Assembly);
        service.AddMediatR(typeof(UserNameView.HousePositionTaking.Handler).Assembly);
        service.AddMediatR(typeof(UserNameViewMain.History.Handler).Assembly);
        service.AddMediatR(typeof(UserNameViewMain.Normal.Handler).Assembly);
        service.AddTransient<UserNameViewCommon.GridOptionHeaderBuilderService, UserNameViewCommon.GridOptionHeaderBuilderServiceImp>();
        service.AddTransient<UserNameViewCommon.GridOptionDataRowBuilderService, UserNameViewCommon.GridOptionDataRowBuilderServiceImp>();
        service.AddTransient<Service<UserNameViewReportModel, UserNameViewMain.History.Criteria>, UserNameViewMain.ServiceImp<UserNameViewMain.History.Criteria>>();
        service.AddTransient<Service<UserNameViewReportModel, UserNameViewMain.Normal.Criteria>, UserNameViewMain.ServiceImp<UserNameViewMain.Normal.Criteria>>();
        service.AddTransient<SortingService<UserNameViewReportModel>, UserNameViewMain.SortingServiceImp>();
        service.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.AssociatedAccount.History.QueryModel>,
            UserNameView.AssociatedAccount.GridOptionBuilderServiceImp<UserNameView.AssociatedAccount.History.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.AssociatedAccount.Normal.QueryModel>,
            UserNameView.AssociatedAccount.GridOptionBuilderServiceImp<UserNameView.AssociatedAccount.Normal.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.GrandTotal.History.QueryModel>,
            UserNameView.GrandTotal.GridOptionBuilderServiceImp<UserNameView.GrandTotal.History.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameView.GrandTotal.Normal.QueryModel>,
            UserNameView.GrandTotal.GridOptionBuilderServiceImp<UserNameView.GrandTotal.Normal.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameViewMain.History.QueryModel>,
            UserNameViewMain.GridOptionBuilderServiceImp<UserNameViewMain.History.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<UserNameViewReportModel, UserNameViewMain.Normal.QueryModel>,
            UserNameViewMain.GridOptionBuilderServiceImp<UserNameViewMain.Normal.QueryModel>>();
        service.AddTransient<Service<UserNameViewReportModel, UserNameView.GrandTotal.History.Criteria>,
            UserNameView.GrandTotal.ServiceImp<UserNameView.GrandTotal.History.Criteria>>();
        service.AddTransient<Service<UserNameViewReportModel, UserNameView.GrandTotal.Normal.Criteria>,
            UserNameView.GrandTotal.ServiceImp<UserNameView.GrandTotal.Normal.Criteria>>();
        service.AddTransient<Service<UserNameViewReportModel, UserNameView.AssociatedAccount.History.Criteria>,
            UserNameView.AssociatedAccount.ServiceImp<UserNameView.AssociatedAccount.History.Criteria>>();
        service.AddTransient<Service<UserNameViewReportModel, UserNameView.AssociatedAccount.Normal.Criteria>,
            UserNameView.AssociatedAccount.ServiceImp<UserNameView.AssociatedAccount.Normal.Criteria>>();
        service.AddTransient<UserNameViewMain.ExcelReportBuilder, UserNameViewMain.ExcelReportBuilderImp>();
    }

    private static void RegisterCurrencyViewServices(this IServiceCollection service)
    {
        service.AddTransient<CurrencyViewCommon.GridOptionHeaderBuilderService, CurrencyViewCommon.GridOptionHeaderBuilderServiceImp>();
        service.AddTransient<CurrencyViewCommon.GridOptionDataRowBuilderService, CurrencyViewCommon.GridOptionDataRowBuilderServiceImp>();
        service.AddTransient<CurrencyViewMain.Service, CurrencyViewMain.ServiceImp>();
        service.AddTransient<CurrencyViewMain.GridOptionBuilderService, CurrencyViewMain.GridOptionBuilderServiceImp>();
        service.AddTransient<CurrencyViewMain.SortingService, CurrencyViewMain.SortingServiceImp>();
        service.AddTransient<CurrencyViewGrandTotal.Service, CurrencyViewGrandTotal.ServiceImp>();
        service.AddTransient<CurrencyViewGrandTotal.GridOptionBuilderService, CurrencyViewGrandTotal.GridOptionBuilderServiceImp>();
    }

    private static void RegisterTopTwentyServices(this IServiceCollection service)
    {
        service.AddMediatR(typeof(TopTwentyGroupStatistics.History.Handler).Assembly);
        service.AddMediatR(typeof(TopTwentyGroupStatistics.Normal.Handler).Assembly);
        service.AddMediatR(typeof(TopTwentyMain.History.Handler).Assembly);
        service.AddMediatR(typeof(TopTwentyMain.Normal.Handler).Assembly);
        service.AddTransient<TopTwentyCommon.GridOptionHeaderBuilderService, TopTwentyCommon.GridOptionHeaderBuilderServiceImp>();
        service.AddTransient<TopTwentyCommon.GridOptionDataRowBuilderService, TopTwentyCommon.GridOptionDataRowBuilderServiceImp>();
        service.AddTransient<Service<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.History.Criteria>, TopTwentyMain.ServiceImp<TopTwentyMain.History.Criteria>>();
        service.AddTransient<Service<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.Normal.Criteria>, TopTwentyMain.ServiceImp<TopTwentyMain.Normal.Criteria>>();
        service.AddTransient<GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.History.QueryModel>,
            TopTwentyMain.GridOptionBuilderServiceImp<TopTwentyMain.History.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyMain.Normal.QueryModel>,
            TopTwentyMain.GridOptionBuilderServiceImp<TopTwentyMain.Normal.QueryModel>>();
        service.AddTransient<Service<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.History.Criteria>,
            TopTwentyGroupStatistics.ServiceImp<TopTwentyGroupStatistics.History.Criteria>>();
        service.AddTransient<Service<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.Normal.Criteria>,
            TopTwentyGroupStatistics.ServiceImp<TopTwentyGroupStatistics.Normal.Criteria>>();
        service.AddTransient<GridOptionBuilderService<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.History.QueryModel>,
            TopTwentyGroupStatistics.GridOptionBuilderServiceImp<TopTwentyGroupStatistics.History.QueryModel>>();
        service.AddTransient<GridOptionBuilderService<UserNameViewGroupStatisticsWithTotalModel, TopTwentyGroupStatistics.Normal.QueryModel>,
            TopTwentyGroupStatistics.GridOptionBuilderServiceImp<TopTwentyGroupStatistics.Normal.QueryModel>>();
    }

    private static void RegisterHourlyServices(this IServiceCollection service)
    {
        service.AddMediatR(typeof(Hourly.History.Handler).Assembly);
        service.AddMediatR(typeof(Hourly.History.HandlerExcel).Assembly);
        service.AddMediatR(typeof(Hourly.Normal.Handler).Assembly);
        service.AddMediatR(typeof(Hourly.Normal.HandlerExcel).Assembly);
        service.AddTransient<Hourly.Service, Hourly.ServiceImp>();
        service.AddTransient<Hourly.ExcelReportBuilder, Hourly.ExcelReportBuilderImp>();
    }
}