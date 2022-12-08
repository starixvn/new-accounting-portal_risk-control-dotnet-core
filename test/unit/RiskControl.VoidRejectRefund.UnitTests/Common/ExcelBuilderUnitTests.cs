using AutoFixture;
using NSubstitute;
using RiskControl.Core.Configuration;
using RiskControl.VoidRejectRefund.Common;
using System;
using System.Linq;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Common
{
    public class ExcelBuilderUnitTests
    {
        private readonly Fixture fixture = new Fixture();

        [Fact]
        public void Build_StatisticExcelReportModelHasData_ReturnsExpectedExcelFile()
        {
            // Arrange
            var configurationService = Substitute.For<ConfigurationService>();
            configurationService.CurrentDirectory.Returns(AppDomain.CurrentDomain.BaseDirectory);

            var reportModeService = Substitute.For<ReportModeService>();
            reportModeService.GetReportMode(Arg.Compat.Any<ReportType>()).Returns("Daily");

            var httpParameterExcelBase = new HttpParameterExcelBase
            {
                Title = "Daily Void/Reject/Refund From 2022-10-01 To 2022-11-16 (Original currency)",
                ReportBy = ReportType.Daily
            };

            var model = fixture.Create<StatisticExcelReportModel>();

            var excelBuilder = new ExcelBuilderImp(configurationService, reportModeService);

            // Act
            var excelPackage = excelBuilder.Build(httpParameterExcelBase, model);

            // Assert
            Assert.Equal(httpParameterExcelBase.Title, excelPackage.Workbook.Worksheets.First().Cells["A1"].Value.ToString());
            Assert.Equal("Daily Void Reject Refund", excelPackage.Workbook.Worksheets.First().Name);
        }
    }
}
