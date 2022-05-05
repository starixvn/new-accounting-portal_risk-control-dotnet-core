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
using SpecificMemberAssociatedAccount = RiskControl.NonSportsGamesStatistics.SpecificMember.AssociatedAccount;
using SpecificMemberCasinoProduct = RiskControl.NonSportsGamesStatistics.SpecificMember.CasinoProduct;
using SpecificMemberCommon = RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using SpecificMemberDaily = RiskControl.NonSportsGamesStatistics.SpecificMember.Daily;
using SpecificMemberGrandTotal = RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal;
using SpecificMemberMonthly = RiskControl.NonSportsGamesStatistics.SpecificMember.Monthly;
using SpecificMemberProduct = RiskControl.NonSportsGamesStatistics.SpecificMember.Product;
using SpecificMemberUsername = RiskControl.NonSportsGamesStatistics.SpecificMember.Username;
using TopTwentyCommon = RiskControl.NonSportsGamesStatistics.TopTwenty.Common;
using TopTwentyGroupStatistics = RiskControl.NonSportsGamesStatistics.TopTwenty.GroupStatistics;
using TopTwentyMain = RiskControl.NonSportsGamesStatistics.TopTwenty.Main;
using UserNameViewAssociatedAccount = RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount;
using UserNameViewCommon = RiskControl.NonSportsGamesStatistics.UserNameView.Common;
using UserNameViewGrandTotal = RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal;
using UserNameViewMain = RiskControl.NonSportsGamesStatistics.UserNameView.Main;

namespace RiskControl.Sites.DependencyInjections
{
    public static class NonSportsInjection
    {
        public static void RegisterNonSportsServices(this IServiceCollection service)
        {
            service.AddTransient<RawService, RawServiceImp>();
            service.AddTransient<GridOptionRemoveColumnService, GridOptionRemoveColumnServiceImp>();
            service.AddTransient<DataSourceChooser, DataSourceChooserImp>();
            service.AddTransient<HeaderTextByReportService, HeaderTextByReportServiceImp>();
            service.AddTransient<GridOptionCustomExcelCellStyleService, GridOptionCustomExcelCellStyleServiceImp>();
            service.AddTransient<CalculationService, CalculationServiceImp>();

            service.AddTransient<SortingService<DailyViewReportModel>, DailyView.SortingServiceImp>();
            service.AddTransient<GridOptionBuilderService<DailyViewReportModel>, DailyView.GridOptionBuilderServiceImp>();

            service.AddTransient<GridOptionBuilderService<CurrencyViewStatisticsReportModel>, DailyViewGrandTotal.GridOptionBuilderServiceImp>();

            service.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel>, DailyViewGroupStatistics.CompanyServiceImp>();
            service.AddTransient<Service<DailyViewGroupStatisticWithTotalReportModel>, DailyViewGroupStatistics.DeviceServiceImp>();

            service.AddTransient<GridOptionBuilderService<DailyViewGroupStatisticWithTotalReportModel>, DailyViewGroupStatistics.GridOptionBuilderServiceImp>();
            service.AddTransient<SortingService<DailyViewGroupStatisticWithTotalReportModel>, DailyViewGroupStatistics.SortingServiceImp>();

            service.AddTransient<CurrencyViewCommon.GridOptionHeaderBuilderService, CurrencyViewCommon.GridOptionHeaderBuilderServiceImp>();
            service.AddTransient<CurrencyViewCommon.GridOptionDataRowBuilderService, CurrencyViewCommon.GridOptionDataRowBuilderServiceImp>();

            service.AddTransient<CurrencyViewMain.Service, CurrencyViewMain.ServiceImp>();
            service.AddTransient<CurrencyViewMain.GridOptionBuilderService, CurrencyViewMain.GridOptionBuilderServiceImp>();
            service.AddTransient<CurrencyViewMain.SortingService, CurrencyViewMain.SortingServiceImp>();

            service.AddTransient<CurrencyViewGrandTotal.Service, CurrencyViewGrandTotal.ServiceImp>();
            service.AddTransient<CurrencyViewGrandTotal.GridOptionBuilderService, CurrencyViewGrandTotal.GridOptionBuilderServiceImp>();

            service.AddTransient<DailyViewCommon.GridOptionHeaderBuilderService, DailyViewCommon.GridOptionHeaderBuilderServiceImp>();
            service.AddTransient<DailyViewCommon.GridOptionDataRowBuilderService, DailyViewCommon.GridOptionDataRowBuilderServiceImp>();

            service.AddTransient<SortingService<DailyReportModel>, DailyViewDaily.SortingServiceImp>();
            service.AddTransient<GridOptionBuilderService<DailyReportModel>, DailyViewDaily.GridOptionBuilderServiceImp>();

            service.AddTransient<UserNameViewCommon.GridOptionHeaderBuilderService, UserNameViewCommon.GridOptionHeaderBuilderServiceImp>();
            service.AddTransient<UserNameViewCommon.GridOptionDataRowBuilderService, UserNameViewCommon.GridOptionDataRowBuilderServiceImp>();

            service.AddTransient<Service<UserNameViewReportModel>, UserNameViewMain.ServiceImp>();
            service.AddTransient<SortingService<UserNameViewReportModel>, UserNameViewMain.SortingServiceImp>();
            service.AddTransient<GridOptionBuilderService<UserNameViewReportModel>, UserNameViewMain.GridOptionBuilderServiceImp>();

            service.AddTransient<Service<UserNameViewReportModel>, UserNameViewGrandTotal.ServiceImp>();
            service.AddTransient<GridOptionBuilderService<UserNameViewReportModel>, UserNameViewGrandTotal.GridOptionBuilderServiceImp>();

            service.AddTransient<Service<UserNameViewReportModel>, UserNameViewAssociatedAccount.ServiceImp>();
            service.AddTransient<GridOptionBuilderService<UserNameViewReportModel>, UserNameViewAssociatedAccount.GridOptionBuilderServiceImp>();

            service.AddTransient<TopTwentyCommon.GridOptionHeaderBuilderService, TopTwentyCommon.GridOptionHeaderBuilderServiceImp>();
            service.AddTransient<TopTwentyCommon.GridOptionDataRowBuilderService, TopTwentyCommon.GridOptionDataRowBuilderServiceImp>();

            service.AddTransient<Service<List<UserNameViewGroupStatisticsWithTotalModel>>, TopTwentyMain.ServiceImp>();
            service.AddTransient<GridOptionBuilderService<List<UserNameViewGroupStatisticsWithTotalModel>>, TopTwentyMain.GridOptionBuilderServiceImp>();

            service.AddTransient<Service<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyGroupStatistics.ServiceImp>();
            service.AddTransient<GridOptionBuilderService<UserNameViewGroupStatisticsWithTotalModel>, TopTwentyGroupStatistics.GridOptionBuilderServiceImp>();

            service.AddTransient<Hourly.Service, Hourly.ServiceImp>();
            service.AddTransient<Hourly.ExcelReportBuilder, Hourly.ExcelReportBuilderImp>();

            service.AddTransient<UserNameViewMain.ExcelReportBuilder, UserNameViewMain.ExcelReportBuilderImp>();

            service.AddTransient<Service<UserNameViewReportModel>, SpecificMemberUsername.ServiceImp>();

            service.AddTransient<Service<DailyReportModel>, DailyViewDaily.ServiceImp>();

            service.AddTransient<Service<DailyViewReportModel>, DailyView.ServiceImp>();

            service.AddTransient<Service<DailyViewReportModel>, SpecificMemberDaily.ServiceImp>();

            service.AddTransient<Service<DailyViewReportModel>, SpecificMemberProduct.ServiceImp>();

            service.AddTransient<SpecificMemberCommon.UsernameService, SpecificMemberCommon.UsernameServiceImp>();
            service.AddTransient<Service<UserNameViewReportModel>, SpecificMemberAssociatedAccount.ServiceImp>();

            service.AddTransient<SpecificMemberCommon.DailyService, SpecificMemberCommon.DailyServiceImp>();

            service.AddTransient<Service<DailyViewReportModel>, SpecificMemberCasinoProduct.ServiceImp>();

            service.AddTransient<Service<DailyViewReportModel>, SpecificMemberMonthly.ServiceImp>();

            service.AddTransient<Service<CurrencyViewStatisticsReportModel>, DailyViewGrandTotal.ServiceImp>();

            service.AddTransient<Service<CurrencyViewStatisticsReportModel>, SpecificMemberGrandTotal.CasinoProduct.ServiceImp>();

            service.AddTransient<Service<CurrencyViewStatisticsReportModel>, SpecificMemberGrandTotal.Daily.ServiceImp>();

            service.AddTransient<Service<CurrencyViewStatisticsReportModel>, SpecificMemberGrandTotal.Product.ServiceImp>();

            service.AddTransient<SpecificMemberCommon.GrandTotalService, SpecificMemberCommon.GrandTotalServiceImp>();

            service.AddTransient<FilterService, FilterServiceImp>();
        }
    }
}
