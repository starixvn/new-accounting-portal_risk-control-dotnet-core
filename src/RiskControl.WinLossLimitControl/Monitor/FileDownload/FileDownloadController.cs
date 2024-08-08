using Microsoft.AspNetCore.Mvc;
using RiskControl.Configuration;
using RiskControl.WebApiClient;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.FileDownload;

[ApiController]
[Route("api/win-limit-control/download")]
public class FileDownloadController(ConfigurationService configurationService, RichHttpClient richHttpClient) : ControllerBase
{
    [Route("excel")]
    [HttpPost]
    public async Task<IActionResult> Excel(WinLossAnalysisExcelModel model)
    {
        var requestUri = configurationService.DownFileApi;

        var data = await richHttpClient.PostJson<ApiResultModel>(requestUri, model).ConfigureAwait(false);

        return File(data.FileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", data.FilName);
    }
}