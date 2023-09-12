using System;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.DailyView.Main.History;

public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }
}