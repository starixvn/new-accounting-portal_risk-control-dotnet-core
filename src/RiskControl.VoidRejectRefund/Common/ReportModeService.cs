namespace RiskControl.VoidRejectRefund.Common;

public interface ReportModeService
{
    string GetReportMode(ReportType reportBy);
}

public class ReportModeServiceImp : ReportModeService
{
    public string GetReportMode(ReportType reportBy)
    {
        var reportMode = reportBy switch
        {
            ReportType.Daily => "Daily",
            ReportType.Monthly => "Monthly",
            ReportType.Product => "Product",
            ReportType.Currency => "Currency",
            ReportType.Company => "Company",
            ReportType.Device => "Device",
            _ => string.Empty
        };

        return reportMode;
    }
}