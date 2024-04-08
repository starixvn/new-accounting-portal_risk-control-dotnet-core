using Fanex.Excel.Models;
using MediatR;
using RiskControl.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;
using System;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GroupStatistics.Device;

public class QueryModel: BaseStatisticQueryModel, IRequest<GridOptions>
{
    public DateTime FromDate { get; set; }

    [DateRangeLessThan("FromDate", DateRangeConstant.MAX_MONTH)]
    public DateTime ToDate { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }
}