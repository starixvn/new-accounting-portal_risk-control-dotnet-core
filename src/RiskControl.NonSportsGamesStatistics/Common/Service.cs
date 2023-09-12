using System;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Common;

public interface Service<TReportModel, TCriteria>
    where TReportModel : class
    where TCriteria: BaseStatisticCriteria
{
    Task<TReportModel> Query(TCriteria criteria, DateTime winLossDate);
}