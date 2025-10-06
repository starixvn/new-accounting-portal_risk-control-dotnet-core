using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using RiskControl.Configuration;
using RiskControl.SabaPinGoal.Model;
using System.Drawing;

namespace RiskControl.SabaPinGoal.Service;

public interface ExcelReportBuilderService
{
    ExcelPackage CreateExcelPackage(HourlyReportModel model, DateTime winLossDate);
}

public class ExcelReportBuilderServiceImp(ConfigurationService configurationService) : ExcelReportBuilderService
{
    private const string TemplatePath = "Templates/SabaPinGoal/HourlyTemplate.xlsx";

    private const int HourlyAccumulatedStartRowIndex = 5;

    private const int HourlyAccumulatedEndRowIndex = 28;

    private const int HourlyStartRowIndex = 35;

    private const int HourlyEndRowIndex = 58;

    private const decimal MaxIncome = 100000;

    private const int OneHundredPercent = 100;

    private const int MaxPercent = 105;

    private ExcelWorksheet averageSheet;

    private ExcelWorksheet statisticSheet;

    public ExcelPackage CreateExcelPackage(HourlyReportModel model, DateTime winLossDate)
    {
        var excelPackage = LoadTemplate();
        ApplySetting();
        CreateStatisticsSheet(model, winLossDate);
        ClearTemplate(excelPackage);

        return excelPackage;
    }

    private ExcelPackage LoadTemplate()
    {
        var templateAbsolutelyPath = $"{configurationService.CurrentDirectory}/{TemplatePath}";
        using var stream = new FileStream(templateAbsolutelyPath, FileMode.Open, FileAccess.Read);
        var excelPackage = new ExcelPackage(stream);
        statisticSheet = excelPackage.Workbook.Worksheets["Template"];
        averageSheet = excelPackage.Workbook.Worksheets["Average"];
        return excelPackage;
    }

    private void ApplySetting()
    {
        statisticSheet.Name = "Hourly Report";
        statisticSheet.OutLineSummaryBelow = false;
    }

    private void ClearTemplate(ExcelPackage excelPackage)
    {
        excelPackage.Workbook.Worksheets.Delete(averageSheet);
    }

    private void CreateStatisticsSheet(HourlyReportModel model, DateTime winlossDate)
    {
        ApplyAccumulatedHourly(model.HourlyStatisticAccumulated, winlossDate);
        ApplyHourly(model.HourlyStatistics, winlossDate);
        ModifyGameInComeAndGamePayOut(HourlyAccumulatedStartRowIndex, HourlyAccumulatedEndRowIndex);
        ModifyGameInComeAndGamePayOut(HourlyStartRowIndex, HourlyEndRowIndex);
    }

    private void ApplyTitle(string title, string cellRange)
    {
        statisticSheet.Cells["A1:M2"].Copy(statisticSheet.Cells[cellRange]);
        statisticSheet.Cells[cellRange].Value = title;
        statisticSheet.Cells[cellRange].Merge = true;
        statisticSheet.Cells[cellRange].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
    }

    private void ApplyHeader(string cellRange)
    {
        statisticSheet.Cells["A3:M4"].Copy(statisticSheet.Cells[cellRange]);
    }

    private void ApplyHourlyStatistics(List<HourlyStatistics> statistics, int startRowIndex)
    {
        statisticSheet.ApplyVertical(statistics, startRowIndex);
    }

    private void ApplyAveragePlayer(double? averagePlayer)
    {
        averageSheet.Cells["A1:M1"].Copy(statisticSheet.Cells["A29:M29"]);
        statisticSheet.Cells["B29:B29"].Value = averagePlayer;
    }

    private void ApplyAccumulatedHourly(HourlyStatisticsAccumulatedModel model, DateTime winlossDate)
    {
        var title = $"Accumulated Hourly Statistics Record  on {winlossDate:MMM dd, yyyy}";
        ApplyTitle(title, "A1:M2");
        ApplyHourlyStatistics(model.HourlyStatistics, HourlyAccumulatedStartRowIndex);
        ApplyAveragePlayer(model.AveragePlayer);
    }

    private void ApplyHourly(List<HourlyStatistics> model, DateTime winlossDate)
    {
        var title = $"Hourly Statistics Record  on {winlossDate:MMM dd, yyyy}";
        ApplyTitle(title, "A31:M32");
        ApplyHeader("A33:M34");
        ApplyHourlyStatistics(model, HourlyStartRowIndex);
    }

    private void ModifyGameInComeAndGamePayOut(int startRow, int endRow)
    {
        for (var i = startRow; i <= endRow; i++)
        {
            if (Convert.ToDecimal(statisticSheet.Cells[$"G{i}:G{i}"].Value) <= -MaxIncome)
            {
                statisticSheet.Cells[$"G{i}:G{i}"].Style.Fill.BackgroundColor.SetColor(Color.Yellow);
            }

            if (Convert.ToDecimal(statisticSheet.Cells[$"H{i}:H{i}"].Value) * OneHundredPercent > MaxPercent)
            {
                statisticSheet.Cells[$"H{i}:H{i}"].Style.Fill.BackgroundColor.SetColor(Color.Yellow);
            }

            if (statisticSheet.Cells[$"E{i}:E{i}"].Value == null)
            {
                statisticSheet.Cells[$"H{i}:H{i}"].Value = string.Empty;
            }

            if (statisticSheet.Cells[$"E{i}:E{i}"].Value != null &&
                Convert.ToDecimal(statisticSheet.Cells[$"E{i}:E{i}"].Value) == 0)
            {
                statisticSheet.Cells[$"H{i}:H{i}"].Value = "N/A";
            }
        }
    }
}