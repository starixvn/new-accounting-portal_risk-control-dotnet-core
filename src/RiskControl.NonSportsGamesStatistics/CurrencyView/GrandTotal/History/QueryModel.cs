using System;
using Fanex.Excel.Models;
using MediatR;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal.History
{
    public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
    {
        private const int MaxDayRange = 6;

        public DateTime FromDate { get; set; }

        [DateRangeLessThan("FromDate", MaxDayRange)]
        public DateTime ToDate { get; set; }

        public int DrillDownCurrency { get; set; }
    }
}