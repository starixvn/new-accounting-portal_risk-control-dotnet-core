using System.Collections.Generic;
using System.IO;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using RiskControl.Core.Configuration;

namespace RiskControl.VoidRejectRefund.Common
{
    public interface GroupExcelBuilder
    {
        ExcelPackage Build(HttpParameterExcelBase excelParams, GroupStatisticExcelReportModel model);
    }

    public class GroupExcelBuilderImp : GroupExcelBuilder
    {
        private const int ReportExcelStartIndex = 4;

        private readonly ConfigurationService configurationService;

        private readonly ReportModeService reportModeService;

        private ExcelWorksheet summarySheet;

        private ExcelWorksheet tempSheet;

        private ExcelWorksheet totalSheet;

        private ExcelWorksheet grandTotalSheet;

        private int StartRowIndex { get; set; }

        private ExcelPackage ExcelPackage { get; set; }

        public GroupExcelBuilderImp(ConfigurationService configurationService, ReportModeService reportModeService)
        {
            this.configurationService = configurationService;
            this.reportModeService = reportModeService;
        }

        public ExcelPackage Build(HttpParameterExcelBase excelParams, GroupStatisticExcelReportModel model)
        {
            LoadTemplate(excelParams.ReportBy);
            SetStartRowIndex();
            BuilTitle(excelParams.Title);
            BuilBody(model.Statistics);
            summarySheet.ApplyModel(grandTotalSheet, model.GrandTotal, StartRowIndex);
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
                tempSheet = ExcelPackage.Workbook.Worksheets.Copy("Void Reject Refund", "Temp Sheet");
                totalSheet = ExcelPackage.Workbook.Worksheets["Sub Total"];
                grandTotalSheet = ExcelPackage.Workbook.Worksheets["Grand Total"];
            }
        }

        private void SetStartRowIndex()
        {
            StartRowIndex = ReportExcelStartIndex;
        }

        private void BuilTitle(string title)
        {
            summarySheet.Cells["A1:J1"].Value = title;
        }

        private void BuilBody(List<GroupStatisticExcelModel> groupStatistics)
        {
            foreach (var group in groupStatistics)
            {
                BuilGroupStatistic(group);
            }
        }

        private void BuilGroupStatistic(GroupStatisticExcelModel groupStatistics)
        {
            summarySheet.ApplyModel(totalSheet, groupStatistics.Total, StartRowIndex);
            StartRowIndex++;
            foreach (var childGroup in groupStatistics.Statistics)
            {
                var endMergeRowIndex = StartRowIndex + childGroup.Statistics.Count - 1;
                summarySheet.ApplyVertical(tempSheet, childGroup.Statistics, StartRowIndex);
                summarySheet.AutoMergeRowsHaveSameValue($"A{StartRowIndex}:A{endMergeRowIndex}");
                summarySheet.Cells[$"A{StartRowIndex}:A{endMergeRowIndex}"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                StartRowIndex = endMergeRowIndex + 1;
            }
        }

        private void ClearTemplate()
        {
            ExcelPackage.Workbook.Worksheets.Delete("Void Reject Refund");
            ExcelPackage.Workbook.Worksheets.Delete("Sub Total");
            ExcelPackage.Workbook.Worksheets.Delete("Temp Sheet");
            ExcelPackage.Workbook.Worksheets.Delete("Grand Total");
        }
    }
}
