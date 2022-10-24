using System;
using MediatR;
using OfficeOpenXml;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.Hourly.History
{
    public class QueryModelExcel : BaseStatisticQueryModel, IRequest<ExcelPackage>
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public bool UsernameDrillDown { get; set; }
    }
}