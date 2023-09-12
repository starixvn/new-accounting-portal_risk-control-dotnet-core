using System;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.Hourly.History;

public class QueryModel : BaseStatisticQueryModel, IRequest<HourlyReportModel>
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public bool UsernameDrillDown { get; set; }
}