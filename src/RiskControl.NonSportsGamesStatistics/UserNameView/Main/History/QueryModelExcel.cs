using System;
using MediatR;
using OfficeOpenXml;
using Olympus.WebApi.Attributes;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main.History
{
    public class QueryModelExcel : BaseStatisticQueryModel, IRequest<ExcelPackage>
    {
        private const int MaxDayRange = 6;

        public DateTime FromDate { get; set; }

        [DateRangeLessThan("FromDate", MaxDayRange)]
        public DateTime ToDate { get; set; }

        public bool IsDrillDown { get; set; }

        public int RoleId { get; set; }

        public bool IsGrandTotal { get; set; }
    }
}