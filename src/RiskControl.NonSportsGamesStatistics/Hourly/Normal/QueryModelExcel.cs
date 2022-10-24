using System;
using MediatR;
using OfficeOpenXml;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.Hourly.Normal
{
    public class QueryModelExcel : BaseStatisticQueryModel, IRequest<ExcelPackage>
    {
        public DateTime WinLostDate { get; set; }

        public bool UsernameDrillDown { get; set; }
    }
}