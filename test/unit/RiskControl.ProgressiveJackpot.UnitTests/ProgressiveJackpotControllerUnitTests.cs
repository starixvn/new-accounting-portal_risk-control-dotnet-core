using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using OfficeOpenXml;
using Olympus.WebApi.Results;
using RiskControl.Core.Configuration;
using RiskControl.ProgressiveJackpot.ApiModel;
using RiskControl.ProgressiveJackpot.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.ProgressiveJackpot.UnitTests;

using Xunit.Asserts.Compare;

public class ProgressiveJackpotControllerUnitTests
{
    private readonly ExcelPackage defaultExcelPackage = new();

    [Fact]
    public async Task GameGroup_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new GameGroupResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.GameGroup(new GameGroupCallMessage()) as OkObjectResult;

        DeepAssert.Equal(actualResults.Value, dataFromProgressiveApiClient.GameGroups);
    }

    [Fact]
    public async Task GameType_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new GameTypeResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.GameType(new GameTypeCallMessage()) as OkObjectResult;

        DeepAssert.Equal(actualResults.Value, dataFromProgressiveApiClient.GameTypes);
    }


    [Fact]
    public async Task JackpotType_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new JackpotTypeResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.JackpotType(new JackpotTypeCallMessage()) as OkObjectResult;

        DeepAssert.Equal(actualResults.Value, dataFromProgressiveApiClient.JackpotTypes);
    }

    [Fact]
    public async Task RealTime_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new ReportRealTimeResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.RealTime(new ReportCallMessage()) as OkObjectResult;

        DeepAssert.Equal(actualResults.Value, dataFromProgressiveApiClient.PJRealtimeReports);
    }

    [Fact]
    public async Task RealTimeExcel_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new ReportRealTimeResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.RealTimeExcel(new ReportCallMessage()) as EpplusExcelResult;

        DeepAssert.Equal(actualResults.ExcelPackage, defaultExcelPackage);
    }

    [Fact]
    public async Task Monthly_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new ReportMonthlyResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.Monthly(new ReportMonthlyCallMessage()) as OkObjectResult;

        DeepAssert.Equal(actualResults.Value, dataFromProgressiveApiClient.PJMonthlyReports);
    }

    [Fact]
    public async Task MonthlyExcel_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new ReportMonthlyResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.MonthlyExcel(new ReportMonthlyCallMessage()) as EpplusExcelResult;

        DeepAssert.Equal(actualResults.ExcelPackage, defaultExcelPackage);
    }

    [Fact]
    public async Task Daily_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new ReportDailyResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.Daily(new ReportDailyCallMessage()) as OkObjectResult;

        DeepAssert.Equal(actualResults.Value, dataFromProgressiveApiClient.PJDailyReports);
    }

    [Fact]
    public async Task DailyExcel_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new ReportDailyResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.DailyExcel(new ReportDailyCallMessage());

        DeepAssert.Equal((actualResults as EpplusExcelResult).ExcelPackage, defaultExcelPackage);
    }

    [Fact]
    public async Task WinRecord_Always_ReturnsDataFromProgressiveApiClient()
    {
        var dataFromProgressiveApiClient = new ReportWinnerRecordResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.WinRecord(new ReportCallMessage()) as OkObjectResult;

        DeepAssert.Equal(actualResults.Value, dataFromProgressiveApiClient.PJWinnerReports);
    }

    [Fact]
    public async Task WinnerExcel_Always_ReturnsDataFromExcelBuilder()
    {
        var dataFromProgressiveApiClient = new ReportWinnerRecordResultContent();
        var controller = CreateProgressiveController(dataFromProgressiveApiClient);

        var actualResults = await controller.WinRecordExcel(new ReportCallMessage());

        DeepAssert.Equal((actualResults as EpplusExcelResult).ExcelPackage, defaultExcelPackage);
    }


    private ProgressiveJackpotController CreateProgressiveController<T>(T model)
    {
        var configurationService = Substitute.For<ConfigurationService>();
        configurationService.ProgressiveJackpotAPI.Returns(string.Empty);

        var progressiveApiClient = Substitute.For<ProgressiveApiClient>();
        progressiveApiClient.PostJson<T>(Arg.Compat.Any<string>(), Arg.Compat.Any<object>())
            .Returns(model);

        var excelBuilder = Substitute.For<ExcelBuilder>();
        excelBuilder.Build(Arg.Compat.Any<string>(), Arg.Compat.Any<List<ReportRealTimeModel>>()).Returns(defaultExcelPackage);
        excelBuilder.Build(Arg.Compat.Any<string>(), Arg.Compat.Any<List<ReportMonthlyModel>>()).Returns(defaultExcelPackage);
        excelBuilder.Build(Arg.Compat.Any<string>(), Arg.Compat.Any<List<ReportDailyModel>>()).Returns(defaultExcelPackage);
        excelBuilder.Build(Arg.Compat.Any<string>(), Arg.Compat.Any<List<ReportWinRecordModel>>()).Returns(defaultExcelPackage);

        return new ProgressiveJackpotController(configurationService, progressiveApiClient, excelBuilder);
    }
}