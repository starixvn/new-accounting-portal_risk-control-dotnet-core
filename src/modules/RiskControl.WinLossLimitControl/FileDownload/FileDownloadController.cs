using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Olympus.DotNetCore.Authentication;
using Olympus.DotNetCore.WebApiClient;
using RiskControl.WinLossLimitControl.Configurations;

namespace RiskControl.WinLossLimitControl.FileDownload
{
    [Authorize]
    public class FileDownloadController : Controller
    {
        private readonly RichHttpClient richHttpClient;

        public FileDownloadController(RichHttpClient richHttpClient)
        {
            this.richHttpClient = richHttpClient;
        }


        [Function(FunctionKeys.WinLimitControl, Policy.Read)]
        [Route("api/[controller]/Excel")]
        public IActionResult Excel([FromServices] IOptions<WinLossLimitControlOptions> winLossLimitControlOptions, string filename)
        {
            var url = $"{winLossLimitControlOptions.Value.FileServiceApi}?site={winLossLimitControlOptions.Value.SiteName}&name={filename}";
            var fileApiResult = richHttpClient.Get<ReadResult>(url).Result;
            var mimeType = "application/vnd.ms-excel";

            if (fileApiResult != null && fileApiResult.Result.ErrorCode == 0)
            {
                return File(fileApiResult.Content, mimeType, filename);
            }
            else
            {
                return NotFound();
            }
        }
    }
}