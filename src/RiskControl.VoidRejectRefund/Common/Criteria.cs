using System;
using Fanex.Data;
using Fanex.Data.Repository;

namespace RiskControl.VoidRejectRefund.Common
{
    public class Criteria : CriteriaBase
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

        public string SportBetType { get; set; }

        [SpParam(Ignored = true)]
        public ReportType ReportBy { get; set; }

        public override string GetSettingKey()
        {
            string settingKey = string.Empty;

            switch (ReportBy)
            {
                case ReportType.Daily:
                    settingKey = "Void_Recject_Refund_Daily";
                    break;

                case ReportType.Monthly:
                    settingKey = "Void_Recject_Refund_Monthly";
                    break;

                case ReportType.Product:
                    settingKey = "Void_Recject_Refund_Product";
                    break;

                case ReportType.Currency:
                    settingKey = "Void_Recject_Refund_Currency";
                    break;

                case ReportType.Company:
                    settingKey = "Void_Recject_Refund_Company";
                    break;

                case ReportType.Device:
                    settingKey = "Void_Recject_Refund_Device";
                    break;

                default:
                    settingKey = string.Empty;
                    break;
            }

            return settingKey;
        }

        public override bool IsValid() => true;
    }
}