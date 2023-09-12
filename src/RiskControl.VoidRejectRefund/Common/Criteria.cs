using System;
using Fanex.Data;
using Fanex.Data.Repository;

namespace RiskControl.VoidRejectRefund.Common;

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
        var settingKey = ReportBy switch
        {
            ReportType.Daily => "Void_Reject_Refund_Daily",
            ReportType.Monthly => "Void_Reject_Refund_Monthly",
            ReportType.Product => "Void_Reject_Refund_Product",
            ReportType.Currency => "Void_Reject_Refund_Currency",
            ReportType.Company => "Void_Reject_Refund_Company",
            ReportType.Device => "Void_Reject_Refund_Device",
            _ => string.Empty
        };

        return settingKey;
    }

    public override bool IsValid() => true;
}