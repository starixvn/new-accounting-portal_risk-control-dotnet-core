using System;
using Fanex.Excel.Models;
using MediatR;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.Main.History
{
    public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
    {
        private const int MaxDayRange = 6;

        public DateTime FromDate { get; set; }

        [DateRangeLessThan("FromDate", MaxDayRange)]
        public DateTime ToDate { get; set; }

        public bool IsDrillDown { get; set; }

        public int TopType { get; set; }

        public int RoleId { get; set; }
    }
}