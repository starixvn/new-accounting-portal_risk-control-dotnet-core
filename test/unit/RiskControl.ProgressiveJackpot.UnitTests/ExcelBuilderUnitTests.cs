using AutoFixture;
using NSubstitute;
using RiskControl.Core.Configuration;
using RiskControl.ProgressiveJackpot.Model;
using System;
using System.Linq;
using Xunit;

namespace RiskControl.ProgressiveJackpot.UnitTests;

public class ExcelBuilderUnitTests
{
    private readonly Fixture fixture = new();

    [Fact]
    public void Build_RealTimeModelWithOneItem_ReturnsExcelFileWithOneRow()
    {
        // Arrange
        var configurationService = Substitute.For<ConfigurationService>();
        configurationService.CurrentDirectory.Returns(AppDomain.CurrentDomain.BaseDirectory);

        var excelBuilder = new ExcelBuilderImp(configurationService);

        // Act
        var models = fixture.CreateMany<ReportRealTimeModel>(1);
        var excelPackage = excelBuilder.Build("RealTime", models);

        // Assert
        Assert.NotNull(excelPackage.Workbook.Worksheets.First().Cells["A5"].Value.ToString());
    }

    [Fact]
    public void Build_MonthlyModelWithOneItem_ReturnsExcelFileWithOneRow()
    {
        // Arrange
        var configurationService = Substitute.For<ConfigurationService>();
        configurationService.CurrentDirectory.Returns(AppDomain.CurrentDomain.BaseDirectory);

        var excelBuilder = new ExcelBuilderImp(configurationService);

        // Act
        var models = fixture.CreateMany<ReportMonthlyModel>(1);
        var excelPackage = excelBuilder.Build("Monthly", models);

        // Assert
        Assert.NotNull(excelPackage.Workbook.Worksheets.First().Cells["A5"].Value.ToString());
    }

    [Fact]

    public void Build_DailyModelWithOneItem_ReturnsExcelFileWithOneRow()
    {
        // Arrange
        var configurationService = Substitute.For<ConfigurationService>();
        configurationService.CurrentDirectory.Returns(AppDomain.CurrentDomain.BaseDirectory);

        var excelBuilder = new ExcelBuilderImp(configurationService);

        // Act
        var models = fixture.CreateMany<ReportDailyModel>(1);
        var excelPackage = excelBuilder.Build("Daily", models);

        // Assert
        Assert.NotNull(excelPackage.Workbook.Worksheets.First().Cells["A5"].Value.ToString());
    }

    [Fact]

    public void Build_WinRecordModelWithOneItem_ReturnsExcelFileWithOneRow()
    {
        // Arrange
        var configurationService = Substitute.For<ConfigurationService>();
        configurationService.CurrentDirectory.Returns(AppDomain.CurrentDomain.BaseDirectory);

        var excelBuilder = new ExcelBuilderImp(configurationService);

        // Act
        var models = fixture.CreateMany<ReportWinRecordModel>(1);
        var excelPackage = excelBuilder.Build("WinRecord", models);

        // Assert
        Assert.NotNull(excelPackage.Workbook.Worksheets.First().Cells["A5"].Value.ToString());
    }
}