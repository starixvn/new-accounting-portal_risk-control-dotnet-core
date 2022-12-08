using AutoFixture;
using NSubstitute;
using RiskControl.Core.Configuration;
using RiskControl.VoidRejectRefund.Common;
using System;
using System.Linq;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Common
{
    public class GroupExcelBuilderUnitTests
    {
        private readonly Fixture fixture = new Fixture();

        [Fact]
        public void Build_GroupStatisticExcelReportModelHasData_ReturnsExpectedExcelFile()
        {
            // Arrange
            var configurationService = Substitute.For<ConfigurationService>();
            configurationService.CurrentDirectory.Returns(AppDomain.CurrentDomain.BaseDirectory);

            var reportModeService = Substitute.For<ReportModeService>();
            reportModeService.GetReportMode(Arg.Compat.Any<ReportType>()).Returns("Company");

            var httpParameterExcelBase = new HttpParameterExcelBase
            {
                Title = "Company Void/Reject/Refund From 2022-10-01 To 2022-11-16 (Original currency)",
                ReportBy = ReportType.Company
            };

            var model = fixture.Create<GroupStatisticExcelReportModel>();

            var excelBuilder = new GroupExcelBuilderImp(configurationService, reportModeService);

            // Act
            var excelPackage = excelBuilder.Build(httpParameterExcelBase, model);

            // Assert
            Assert.Equal(httpParameterExcelBase.Title, excelPackage.Workbook.Worksheets.First().Cells["A1"].Value.ToString());
            Assert.Equal("Company Void Reject Refund", excelPackage.Workbook.Worksheets.First().Name);
        }
    }
}
