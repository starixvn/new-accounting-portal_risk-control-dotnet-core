using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using RiskControl.Configuration;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.Hourly;

public interface ExcelReportBuilder
{
    ExcelPackage CreateExcelPackage(HourlyReportModel model, DateTime winLossDate, bool viewByInteger);
}

public class ExcelReportBuilderImp : ExcelReportBuilder
{
    private const string TemplatePath = @"Templates/NonSport/HourlyTemplate.xlsx";

    private const string ViewByIntegerTemplatePath = @"Templates/NonSport/ViewByIntegerHourlyTemplate.xlsx";

    private const int HourlyAccumulatedStartRowIndex = 5;

    private const int HourlyAccumulatedEndRowIndex = 28;

    private const int HourlyStartRowIndex = 35;

    private const int HourlyEndRowIndex = 58;

    private const decimal MaxIncome = 100000;

    private const int OneHundredPercent = 100;

    private const int MaxPercent = 105;

    private readonly ConfigurationService configurationService;

    private ExcelWorksheet averageSheet;

    private ExcelWorksheet statisticSheet;

    public ExcelReportBuilderImp(ConfigurationService configurationService)
    {
        this.configurationService = configurationService;
    }

    public ExcelPackage CreateExcelPackage(HourlyReportModel model, DateTime winLossDate, bool viewByInteger)
    {
        var excelPackage = LoadTemplate(viewByInteger);
        ApplySetting();
        CreateStatisticsSheet(model, winLossDate);
        ClearTemplate(excelPackage);

        return excelPackage;
    }

    private ExcelPackage LoadTemplate(bool viewByInteger)
    {
        var templatePath = viewByInteger ? ViewByIntegerTemplatePath : TemplatePath;
        var templateAbsolutelyPath = $"{configurationService.CurrentDirectory}/{templatePath}";
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
        statisticSheet.Cells["A1:O2"].Copy(statisticSheet.Cells[cellRange]);
        statisticSheet.Cells[cellRange].Value = title;
        statisticSheet.Cells[cellRange].Merge = true;
        statisticSheet.Cells[cellRange].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
    }

    private void ApplyHeader(string cellRange)
    {
        statisticSheet.Cells["A3:O4"].Copy(statisticSheet.Cells[cellRange]);
    }

    private void ApplyHourlyStatistics(List<HourlyStatistics> statistics, int startRowIndex)
    {
        statisticSheet.ApplyVertical(statistics, startRowIndex);
    }

    private void ApplyAveragePlayer(double? averagePlayer)
    {
        averageSheet.Cells["A1:O1"].Copy(statisticSheet.Cells["A29:O29"]);
        statisticSheet.Cells["B29:B29"].Value = averagePlayer;
    }

    private void ApplyAccumulatedHourly(HourlyStatisticsAccumulatedModel model, DateTime winlossDate)
    {
        var title = $"Accumulated Hourly Statistics Record  on {winlossDate:MMM dd, yyyy}";
        ApplyTitle(title, "A1:O2");
        ApplyHourlyStatistics(model.HourlyStatistics, HourlyAccumulatedStartRowIndex);
        ApplyAveragePlayer(model.AveragePlayer);
    }

    private void ApplyHourly(List<HourlyStatistics> model, DateTime winlossDate)
    {
        var title = $"Hourly Statistics Record  on {winlossDate:MMM dd, yyyy}";
        ApplyTitle(title, "A31:O32");
        ApplyHeader("A33:O34");
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