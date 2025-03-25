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
    [Route("guid")]
    [HttpPost]
    public async Task<IActionResult> GetGuid(WinLossAnalysisExcelModel model)
    {
        var requestUri = $"{configurationService.DownFileApi}/File";

        var data = await richHttpClient.PostJson<ApiResultModel>(requestUri, model).ConfigureAwait(false);

        return Ok(data);
    }

    [HttpGet("file")]
    public async Task<IActionResult> CheckFile(string guid)
    {
        var requestUri = $"{configurationService.DownFileApi}/File/GetFile";

        var json = await richHttpClient.PostJson<string>(requestUri, guid).ConfigureAwait(false);

        var result = json != null ? JsonConvert.DeserializeObject<ApiResultModel>(json) : new ApiResultModel();

        return Ok(result);
    }

    [HttpGet("excel")]
    public FileStreamResult Excel(string fileName)
    {
        var path = $"{configurationService.FileServerDirectory}/{fileName.Replace("/Excel/", "")}";
        var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous);
        return File(fileStream, "application/vnd.ms-excel", Path.GetFileName(path));
    }

    [HttpGet("excel-web")]
    public FileStreamResult ExcelWeb(string fileName)
    {
        var path = $"{configurationService.CwlFileServerDirectory}/{fileName.Replace("/Excel/", "")}";
        var fileStream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.Asynchronous);
        return File(fileStream, "application/vnd.ms-excel", Path.GetFileName(path));
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