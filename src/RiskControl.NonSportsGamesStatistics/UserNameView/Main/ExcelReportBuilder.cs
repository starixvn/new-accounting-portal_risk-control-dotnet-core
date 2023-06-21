using System.Collections.Generic;
using System.IO;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using RiskControl.Core.Configuration;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main
{
    public interface ExcelReportBuilder
    {
        ExcelPackage CreateExcelPackage(UserNameViewReportModel model, BaseStatisticQueryModel queryModel);
    }

    public class ExcelReportBuilderImp : ExcelReportBuilder
    {
        private const string TemplatePath = @"Templates/NonSport/Template.xlsx";

        private const string ViewByIntegerTemplatePath = @"Templates/NonSport/ViewByIntegerTemplate.xlsx";

        private const int StartRowIndex = 5;

        private const int HousePositionTakingColumnIndex = 16;

        private const int TitleEndRow = 2;

        private const int TitleEndColumn = 16;

        private readonly ConfigurationService configurationService;

        private ExcelWorksheet statisticSheet;

        private ExcelWorksheet totalTemplateSheet;

        private int endRowIndex;

        public ExcelReportBuilderImp(ConfigurationService configurationService)
        {
            this.configurationService = configurationService;
        }

        public ExcelPackage CreateExcelPackage(UserNameViewReportModel model, BaseStatisticQueryModel queryModel)
        {
            var excelPackage = LoadTemplate(queryModel.ViewByInteger);
            ApplySetting();
            CreateStatisticsSheet(model, queryModel);
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
            totalTemplateSheet = excelPackage.Workbook.Worksheets["TotalTemplate"];

            return excelPackage;
        }

        private void ApplySetting()
        {
            statisticSheet.OutLineSummaryBelow = false;
        }

        private void ClearTemplate(ExcelPackage excelPackage)
        {
            excelPackage.Workbook.Worksheets.Delete(totalTemplateSheet);
        }

        private void CreateStatisticsSheet(UserNameViewReportModel model, BaseStatisticQueryModel queryModel)
        {
            SetSheetName(queryModel.ReportBy);
            SetEndRowIndex(StartRowIndex, model.Statistics.Count);
            SetFirstHeaderColumnName(queryModel.ReportBy);
            ApplyTitle(queryModel.Title);
            ApplyUserNameStatistics(model.Statistics);
            ApplyGrandTotalStatistics(model.GrandTotal);

            if (!queryModel.IsNormalMode)
            {
                RemoveHousePositionTakingInHistory();
            }
        }

        private void SetSheetName(string reportBy)
        {
            statisticSheet.Name = $"{reportBy} Statistics";
        }

        private void SetFirstHeaderColumnName(string reportBy)
        {
            statisticSheet.Cells["A4"].Value = reportBy;
        }

        private void ApplyTitle(string title)
        {
            statisticSheet.Cells[1, 1, TitleEndRow, TitleEndColumn].Value = title;
        }

        private void ApplyUserNameStatistics(List<UserNameViewStatisticsModel> statistics)
        {
            statisticSheet.ApplyVertical(statistics, StartRowIndex);
        }

        private void ApplyGrandTotalStatistics(UserNameViewStatisticsModel grandTotal)
        {
            statisticSheet.ApplyModel(totalTemplateSheet, grandTotal, endRowIndex);
        }

        private void RemoveHousePositionTakingInHistory()
        {
            statisticSheet.DeleteColumn(HousePositionTakingColumnIndex);
        }

        private void SetEndRowIndex(int startRowIndex, int numberBodyItems)
        {
            endRowIndex = startRowIndex + numberBodyItems;
        }
    }
}