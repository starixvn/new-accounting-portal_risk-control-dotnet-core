using Microsoft.AspNetCore.Mvc;
using RiskControl.Configuration;
using RiskControl.WebApiClient;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;

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

        return File(data.FileContent, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", data.FileName);
    }

    [Route("guid-member-wl-file")]
    [HttpPost]
    public async Task<IActionResult> GetGuidMemberWLFile(MemberWLDownloadFileModel model)
    {
        var requestUri = $"{configurationService.CWLAnalysisApi}/File";

        var data = await richHttpClient.PostJson<ApiResultModel>(requestUri, model).ConfigureAwait(false);

        return Ok(data);
    }

    [HttpGet("member-wl-file")]
    public async Task<IActionResult> CheckMemberWLFile(string guid)
    {
        var requestUri = $"{configurationService.CWLAnalysisApi}/File/GetFile";

        var json = await richHttpClient.PostJson<string>(requestUri, guid).ConfigureAwait(false);

        var result = json != null ? JsonConvert.DeserializeObject<ApiResultModel>(json) : new ApiResultModel();

        return Ok(result);
    }

    [HttpGet("download-member-wl-file")]
    public FileStreamResult DownloadMemberWLFile(string fileName)
    {
        var path = $"{configurationService.MemberWinLossFileServerDirectory}/{fileName.Replace("/Excel/", "")}";
        var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous);
        return File(fileStream, "application/vnd.ms-excel", Path.GetFileName(path));
    }
}