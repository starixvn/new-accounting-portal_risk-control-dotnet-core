using System.Collections.Generic;
using System.IO;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using RiskControl.Core.Configuration;
using RiskControl.VoidRejectRefund.Common;

namespace RiskControl.VoidRejectRefund.Product
{
    public interface ProductExcelBuilder
    {
        ExcelPackage Build(HttpParameterExcelBase excelParams, ProductModel model);
    }

    public class ProductExcelBuilderImp : ProductExcelBuilder
    {
        private const int ReportExcelStartIndex = 4;

        private readonly ConfigurationService configurationService;

        private readonly ReportModeService reportModeService;

        private ExcelWorksheet productMainSheet;

        private ExcelWorksheet tempSheet;

        private ExcelWorksheet totalFirstLevelSheet;

        private ExcelWorksheet totalSecondLevelSheet;

        private ExcelWorksheet grandTotalSheet;

        private int StartRowIndex { get; set; }

        private ExcelPackage ExcelPackage { get; set; }

        public ProductExcelBuilderImp(ConfigurationService configurationService, ReportModeService reportModeService)
        {
            this.configurationService = configurationService;
            this.reportModeService = reportModeService;
        }

        public ExcelPackage Build(HttpParameterExcelBase excelParams, ProductModel model)
        {
            LoadTemplate(excelParams.ReportBy);
            SetStartRowIndex();
            BuilTitle(excelParams.Title);
            BuilBody(model.ProductStatistics);
            productMainSheet.ApplyModel(grandTotalSheet, model.GrandTotal, StartRowIndex);
            ClearTemplate();
            return ExcelPackage;
        }

        private void LoadTemplate(ReportType reportBy)
        {
            string reportMode = reportModeService.GetReportMode(reportBy);
            var templateAbsolutelyPath = $"{configurationService.CurrentDirectory}/Templates/VoidRejectRefund/{reportMode}.xlsx";
            using (var stream = new FileStream(templateAbsolutelyPath, FileMode.Open, FileAccess.Read))
            {
                ExcelPackage = new ExcelPackage(stream);
                productMainSheet = ExcelPackage.Workbook.Worksheets.Copy("Void Reject Refund", $"{reportMode} Void Reject Refund");
                tempSheet = ExcelPackage.Workbook.Worksheets.Copy("Void Reject Refund", "Temp Sheet");
                totalFirstLevelSheet = ExcelPackage.Workbook.Worksheets["Sub Total 2"];
                totalSecondLevelSheet = ExcelPackage.Workbook.Worksheets["Sub Total"];
                grandTotalSheet = ExcelPackage.Workbook.Worksheets["Grand Total"];
            }
        }

        private void SetStartRowIndex()
        {
            StartRowIndex = ReportExcelStartIndex;
        }

        private void BuilTitle(string title)
        {
            productMainSheet.Cells["A1:I1"].Value = title;
        }

        private void BuilBody(List<ProductStatistic> productStatistics)
        {
            foreach (var product in productStatistics)
            {
                BuilProductStatistic(product);
            }
        }

        private void BuilProductStatistic(ProductStatistic productStatistic)
        {
            productMainSheet.ApplyModel(totalFirstLevelSheet, productStatistic.Total, StartRowIndex);
            StartRowIndex++;
            foreach (var leagueSportBettype in productStatistic.LeagueSportBettypes)
            {
                var numberBettypeRows = leagueSportBettype.Bettypes.Count;
                var firstLevelTempSheet = numberBettypeRows > 0 ? totalSecondLevelSheet : tempSheet;
                productMainSheet.ApplyModel(firstLevelTempSheet, leagueSportBettype.Total, StartRowIndex);
                StartRowIndex++;
                productMainSheet.ApplyVertical(tempSheet, leagueSportBettype.Bettypes, StartRowIndex);
                StartRowIndex += numberBettypeRows;
            }
        }

        private void ClearTemplate()
        {
            ExcelPackage.Workbook.Worksheets.Delete("Void Reject Refund");
            ExcelPackage.Workbook.Worksheets.Delete("Sub Total");
            ExcelPackage.Workbook.Worksheets.Delete("Sub Total 2");
            ExcelPackage.Workbook.Worksheets.Delete("Temp Sheet");
            ExcelPackage.Workbook.Worksheets.Delete("Grand Total");
        }
    }
}
