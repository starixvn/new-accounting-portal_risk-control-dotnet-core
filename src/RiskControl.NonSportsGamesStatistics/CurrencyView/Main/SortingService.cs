using RiskControl.Core.Sort;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.Main;

public interface SortingService
{
    CurrencyViewStatisticsReportModel SortData(CurrencyViewStatisticsReportModel reportModel, string sortDirection, string sortColumnName);
}

public class SortingServiceImp : SortingService
{
    public CurrencyViewStatisticsReportModel SortData(CurrencyViewStatisticsReportModel reportModel, string sortDirection, string sortColumnName)
    {
        Sort.SortByProperty(reportModel.Statistics, sortDirection, sortColumnName);
        return reportModel;
    }
}