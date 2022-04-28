using System;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal.Normal
{
    public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
    {
        public DateTime WinLostDate { get; set; }

        public int DrillDownCurrency { get; set; }
    }
}