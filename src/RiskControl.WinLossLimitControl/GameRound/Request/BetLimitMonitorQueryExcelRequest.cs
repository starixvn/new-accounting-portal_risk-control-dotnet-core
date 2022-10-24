using System;
using MediatR;
using OfficeOpenXml;

namespace RiskControl.WinLossLimitControl.GameRound.Request
{
    public class BetLimitMonitorQueryExcelRequest : IRequest<ExcelPackage>
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string ProductId { get; set; }

        public string BetType { get; set; }

        public bool ExcludeTestData { get; set; }
    }
}
