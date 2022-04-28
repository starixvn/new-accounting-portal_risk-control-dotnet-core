using Fanex.Excel.Models;

namespace RiskControl.NonSportsGamesStatistics.Common
{
    public interface GridOptionBuilderService<in TReportModel> where TReportModel : class
    {
        GridOptions BuildGridOptions(TReportModel statistics, BaseStatisticQueryModel queryModel);
    }
}