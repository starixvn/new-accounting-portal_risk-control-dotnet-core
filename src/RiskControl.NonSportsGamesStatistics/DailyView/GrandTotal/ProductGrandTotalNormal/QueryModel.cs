using System;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.DailyView.GrandTotal.ProductGrandTotalNormal;

public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
{
    public DateTime WinLostDate { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }

    public int CasinoType { get; set; }
}