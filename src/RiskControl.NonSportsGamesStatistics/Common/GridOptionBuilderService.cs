using Fanex.Excel.Models;

namespace RiskControl.NonSportsGamesStatistics.Common
{
    public interface GridOptionBuilderService<in TReportModel, in TQueryModel>
        where TReportModel : class
        where TQueryModel: BaseStatisticQueryModel
    {
        GridOptions BuildGridOptions(TReportModel statistics, TQueryModel queryModel);
    }
}