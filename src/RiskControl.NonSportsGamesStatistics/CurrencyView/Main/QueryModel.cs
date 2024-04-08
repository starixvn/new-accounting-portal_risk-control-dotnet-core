using Fanex.Excel.Models;
using MediatR;
using RiskControl.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;
using System;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.Main;

public class QueryModel: BaseStatisticQueryModel, IRequest<GridOptions>
{
    public DateTime FromDate { get; set; }

    [DateRangeLessThan("FromDate", DateRangeConstant.MAX_MONTH)]
    public DateTime ToDate { get; set; }

    public int DrillDownCurrency { get; set; }
}