using Microsoft.AspNetCore.Mvc;
using RiskControl.Configuration;
using RiskControl.WebApiClient;
using System.IO;
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

    [Route("guid-member-wl-file")]
    [HttpPost]
    public async Task<IActionResult> GetGuidMemberWLFile(MemberWLDownloadFileModel model)
    {
        var requestUri = $"{configurationService.CWLAnalysisApi}/Download";

        var data = await richHttpClient.PostJson<ApiResultModel>(requestUri, model).ConfigureAwait(false);

        return Ok(data);
    }

    [HttpGet("member-wl-file")]
    public async Task<IActionResult> CheckMemberWLFile(string guid)
    {
        var requestUri = $"{configurationService.CWLAnalysisApi}/GetFile";

        var data = await richHttpClient.PostJson<ApiResultModel>(requestUri, guid).ConfigureAwait(false);

        return Ok(data);
    }

    [HttpGet("download-member-wl-file")]
    public FileStreamResult DownloadMemberWLFile(string fileName)
    {
        var path = $"{configurationService.MemberWinLossFileServerDirectory}/{fileName}";
        var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous);
        return File(fileStream, "application/vnd.ms-excel", Path.GetFileName(fileName));
    }
}