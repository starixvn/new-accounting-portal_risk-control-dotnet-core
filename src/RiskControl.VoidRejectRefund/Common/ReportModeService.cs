namespace RiskControl.VoidRejectRefund.Common
{
    public interface ReportModeService
    {
        string GetReportMode(ReportType reportBy);
    }

    public class ReportModeServiceImp : ReportModeService
    {
        public string GetReportMode(ReportType reportBy)
        {
            string reportMode = string.Empty;

            switch (reportBy)
            {
                case ReportType.Daily:
                    reportMode = "Daily";
                    break;
                case ReportType.Monthly:
                    reportMode = "Monthly";
                    break;
                case ReportType.Product:
                    reportMode = "Product";
                    break;
                case ReportType.Currency:
                    reportMode = "Currency";
                    break;
                case ReportType.Company:
                    reportMode = "Company";
                    break;
                case ReportType.Device:
                    reportMode = "Device";
                    break;
                default:
                    reportMode = string.Empty;
                    break;
            }

            return reportMode;
        }
    }
}
