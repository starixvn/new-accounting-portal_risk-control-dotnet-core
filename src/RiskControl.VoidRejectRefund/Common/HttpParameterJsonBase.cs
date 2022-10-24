using System;

namespace RiskControl.VoidRejectRefund.Common
{
    public class HttpParameterJsonBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public string ProductId { get; set; }

        public string Site { get; set; }

        public string Bettype { get; set; }

        public string LeagueId { get; set; }

        public string Sporttype { get; set; }

        public string Currency { get; set; }

        public string Device { get; set; }

        public bool ExcludeTest { get; set; }

        public ReportType ReportBy { get; set; }

        public string SortColumnName { get; set; }

        public string SortDirection { get; set; }

        public string SportBetType { get; set; }
    }
}