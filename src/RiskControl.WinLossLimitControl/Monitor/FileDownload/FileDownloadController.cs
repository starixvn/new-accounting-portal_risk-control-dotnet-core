using Microsoft.AspNetCore.Http;
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

    [Route("member-wl-file")]
    [HttpPost]
    public async Task<IActionResult> MemberWLFile(MemberWLDownloadFileModel model)
    {
        var requestUri = $"{configurationService.CWLAnalysisApi}/File";

        var data = await richHttpClient.PostJson<ApiResultModel>(requestUri, model).ConfigureAwait(false);

        Response.Headers.Append("X-InvalidUsernames", data.InvalidUsernames);

        return File(data.FileContent, "application/zip", data.FilName);
    }
}