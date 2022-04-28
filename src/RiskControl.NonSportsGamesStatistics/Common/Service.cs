using System;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Common
{
    public interface Service<TReportModel>
        where TReportModel : class
    {
        Task<TReportModel> Query(BaseStatisticCriteria criteria, DateTime winLossDate);
    }
}