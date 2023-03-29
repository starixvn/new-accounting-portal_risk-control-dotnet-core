using System;
using Fanex.Excel.Models;
using MediatR;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Product
{
    public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
    {
        public DateTime FromDate { get; set; }

        [DateRangeLessThan("FromDate", DateRangeConstant.MAX_MONTH)]
        public DateTime ToDate { get; set; }

        public bool IsDrillDown { get; set; }

        public bool IsGrandTotal { get; set; }
    }
}