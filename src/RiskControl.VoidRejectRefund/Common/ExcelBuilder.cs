using System.IO;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using RiskControl.Core.Configuration;

namespace RiskControl.VoidRejectRefund.Common
{
    public interface ExcelBuilder
    {
        ExcelPackage Build(HttpParameterExcelBase excelParams, StatisticExcelReportModel model);
    }

    public class ExcelBuilderImp : ExcelBuilder
    {

        private readonly ConfigurationService configurationService;

        private readonly ReportModeService reportModeService;

        private ExcelWorksheet summarySheet;

        private ExcelWorksheet totalSheet;

        private const int StartRowIndex = 4;

        private ExcelPackage ExcelPackage { get; set; }

        public ExcelBuilderImp(ConfigurationService configurationService, ReportModeService reportModeService)
        {
            this.configurationService = configurationService;
            this.reportModeService = reportModeService;
        }

        public ExcelPackage Build(HttpParameterExcelBase excelParams, StatisticExcelReportModel model)
        {
            LoadTemplate(excelParams.ReportBy);
            BuilTitle(excelParams.Title);
            summarySheet.ApplyVertical(model.Statistics, StartRowIndex);
            summarySheet.ApplyModel(totalSheet, model.GrandTotal, StartRowIndex + model.Statistics.Count);
            ClearTemplate();
            return ExcelPackage;
        }

        private void LoadTemplate(ReportType reportBy)
        {
            string reportMode = reportModeService.GetReportMode(reportBy);
            var templateAbsolutelyPath = $"{configurationService.CurrentDirectory}\\Templates\\VoidRejectRefund\\{reportMode}.xlsx";
            using (var stream = new FileStream(templateAbsolutelyPath, FileMode.Open, FileAccess.Read))
            {
                ExcelPackage = new ExcelPackage(stream);
                summarySheet = ExcelPackage.Workbook.Worksheets.Copy("Void Reject Refund", $"{reportMode} Void Reject Refund");
                totalSheet = ExcelPackage.Workbook.Worksheets["Grand Total"];
            }
        }

        private void BuilTitle(string title)
        {
            summarySheet.Cells["A1:I1"].Value = title;
        }

        private void ClearTemplate()
        {
            ExcelPackage.Workbook.Worksheets.Delete("Void Reject Refund");
            ExcelPackage.Workbook.Worksheets.Delete("Grand Total");
        }
    }
}
