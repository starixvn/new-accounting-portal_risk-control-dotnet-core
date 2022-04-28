using System;
using Fanex.Excel.Models;
using MediatR;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Daily
{
    public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
    {
        private const int MaxDayRange = 6;

        public DateTime FromDate { get; set; }

        [DateRangeLessThan("FromDate", MaxDayRange)]
        public DateTime ToDate { get; set; }

        public bool IsDrillDown { get; set; }

        public bool IsGrandTotal { get; set; }

        public bool UsernameDrillDown { get; set; }
    }
}