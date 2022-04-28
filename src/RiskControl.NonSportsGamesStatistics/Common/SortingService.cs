namespace RiskControl.NonSportsGamesStatistics.Common
{
    public interface SortingService<TReportModel> where TReportModel : class
    {
        TReportModel SortData(TReportModel reportModel, string sortDirection, string sortColumnName);
    }
}