using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Configuration;
using RiskControl.ProgressiveJackpot.ApiModel;
using RiskControl.ProgressiveJackpot.Model;

namespace RiskControl.ProgressiveJackpot;

using Results;

[ApiController]
[Route("api/progressive-jackpot")]
public class ProgressiveJackpotController(ConfigurationService configurationService,
        ProgressiveApiClient progressiveApiClient, ExcelBuilder excelBuilder)
    : ControllerBase
{
    [Route("game-group")]
    [HttpPost]
    public async Task<IActionResult> GameGroup(GameGroupCallMessage call)
    {
        var requestUri = $"{configurationService.ProgressiveJackpotAPI}/GetPJGameGroup/";
        var postData = new HttpRequestMessage<GameGroupCallMessage>
        {
            Call = call
        };

        var viewModel = await progressiveApiClient.PostJson<GameGroupResultContent>(requestUri, postData).ConfigureAwait(false);

        return Ok(viewModel.GameGroups);
    }

    [Route("game-type")]
    [HttpPost]
    public async Task<IActionResult> GameType(GameTypeCallMessage call)
    {
        var postData = new HttpRequestMessage<GameTypeCallMessage>
        {
            Call = call
        };
        var requestUri = $"{configurationService.ProgressiveJackpotAPI}/GetPJGameType/";
        var viewModel = await progressiveApiClient.PostJson<GameTypeResultContent>(requestUri, postData).ConfigureAwait(false);

        return Ok(viewModel.GameTypes);
    }

    [Route("jackpot-type")]
    [HttpPost]
    public async Task<IActionResult> JackpotType(JackpotTypeCallMessage call)
    {
        var postData = new HttpRequestMessage<JackpotTypeCallMessage>
        {
            Call = call
        };
        var requestUri = $"{configurationService.ProgressiveJackpotAPI}/GetJackpotType/";
        var viewModel = await progressiveApiClient.PostJson<JackpotTypeResultContent>(requestUri, postData).ConfigureAwait(false);

        return Ok(viewModel.JackpotTypes);
    }

    [Route("real-time")]
    [HttpPost]
    public async Task<IActionResult> RealTime(ReportCallMessage call)
    {
        var viewModel = await GetRealTimeData(call).ConfigureAwait(false);
        return Ok(viewModel.PJRealtimeReports);
    }

    [Route("real-time-excel")]
    [HttpPost]
    public async Task<IActionResult> RealTimeExcel(ReportCallMessage call)
    {
        var viewModel = await GetRealTimeData(call).ConfigureAwait(false);
        var excelPackage = excelBuilder.Build("RealTime", viewModel.PJRealtimeReports);
        return new EpplusExcelResult(excelPackage);
    }

    private async Task<ReportRealTimeResultContent> GetRealTimeData(ReportCallMessage call)
    {
        var postData = new HttpRequestMessage<ReportCallMessage>
        {
            Call = call
        };
        var requestUri = $"{configurationService.ProgressiveJackpotAPI}/PJRealtimeReport/";
        return await progressiveApiClient.PostJson<ReportRealTimeResultContent>(requestUri, postData).ConfigureAwait(false);
    }

    [Route("monthly")]
    [HttpPost]
    public async Task<IActionResult> Monthly(ReportMonthlyCallMessage call)
    {
        var viewModel = await GetMonthlyData(call).ConfigureAwait(false);
        return Ok(viewModel.PJMonthlyReports);
    }

    [Route("monthly-excel")]
    [HttpPost]
    public async Task<IActionResult> MonthlyExcel(ReportMonthlyCallMessage call)
    {
        var viewModel = await GetMonthlyData(call).ConfigureAwait(false);
        var excelPackage = excelBuilder.Build("Monthly", viewModel.PJMonthlyReports);

        return new EpplusExcelResult(excelPackage);
    }

    private async Task<ReportMonthlyResultContent> GetMonthlyData(ReportMonthlyCallMessage call)
    {
        var postData = new HttpRequestMessage<ReportMonthlyCallMessage>
        {
            Call = call
        };
        var requestUri = $"{configurationService.ProgressiveJackpotAPI}/PJMonthlyReport/";
        return await progressiveApiClient.PostJson<ReportMonthlyResultContent>(requestUri, postData).ConfigureAwait(false);
    }

    [Route("daily")]
    [HttpPost]
    public async Task<IActionResult> Daily(ReportDailyCallMessage call)
    {
        var viewModel = await GetDailyData(call).ConfigureAwait(false);
        return Ok(viewModel.PJDailyReports);
    }

    [Route("daily-excel")]
    [HttpPost]
    public async Task<IActionResult> DailyExcel(ReportDailyCallMessage call)
    {
        var viewModel = await GetDailyData(call).ConfigureAwait(false);
        var excelPackage = excelBuilder.Build("Daily", viewModel.PJDailyReports);

        return new EpplusExcelResult(excelPackage);
    }

    private async Task<ReportDailyResultContent> GetDailyData(ReportDailyCallMessage call)
    {
        var postData = new HttpRequestMessage<ReportDailyCallMessage>
        {
            Call = call
        };
        var requestUri = $"{configurationService.ProgressiveJackpotAPI}/PJDailyReport/";
        return await progressiveApiClient.PostJson<ReportDailyResultContent>(requestUri, postData).ConfigureAwait(false);
    }

    [Route("win-record")]
    [HttpPost]
    public async Task<IActionResult> WinRecord(ReportCallMessage call)
    {
        var viewModel = await GetWinRecordData(call).ConfigureAwait(false);
        return Ok(viewModel.PJWinnerReports);
    }

    [Route("win-record-excel")]
    [HttpPost]
    public async Task<IActionResult> WinRecordExcel(ReportCallMessage call)
    {
        var viewModel = await GetWinRecordData(call).ConfigureAwait(false);
        var excelPackage = excelBuilder.Build("WinRecord", viewModel.PJWinnerReports);

        return new EpplusExcelResult(excelPackage);
    }

    private async Task<ReportWinnerRecordResultContent> GetWinRecordData(ReportCallMessage call)
    {
        var postData = new HttpRequestMessage<ReportCallMessage>
        {
            Call = call
        };
        var requestUri = $"{configurationService.ProgressiveJackpotAPI}/PJWinnerReport/";
        return await progressiveApiClient.PostJson<ReportWinnerRecordResultContent>(requestUri, postData).ConfigureAwait(false);
    }
}