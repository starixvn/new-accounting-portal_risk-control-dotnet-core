using System;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Olympus.DotNetCore.Authentication;
using Olympus.DotNetCore.WebApiClient;
using RiskControl.WinLossLimitControl.Configurations;

namespace RiskControl.WinLossLimitControl.FileDownload {
    [Route ("WinLimitControl/FileDownload")]
    public class FileDownloadController : Controller {
        private readonly RichHttpClient richHttpClient;

        public FileDownloadController (RichHttpClient richHttpClient) {
            this.richHttpClient = richHttpClient;
        }

        [Function (FunctionKeys.WinLimitControl, Policy.Read)]
        [Route ("Index")]
        public ActionResult Index (string hash) {
            var base64EncodedBytes = Convert.FromBase64String (hash);
            var filename = Encoding.UTF8.GetString (base64EncodedBytes);
            var model = new FileDownloadModel { FileName = filename };

            return View (model);
        }

        [Function (FunctionKeys.WinLimitControl, Policy.Read)]
        [Route ("Excel")]
        public ActionResult Excel ([FromServices] IOptions<WinLossLimitControlOptions> winLossLimitControlOptions, string filename) {
            var url = $"{winLossLimitControlOptions.Value.FileServiceApi}?site={winLossLimitControlOptions.Value.SiteName}&name={filename}";
            var fileApiResult = richHttpClient.Get<ReadResult> (url).Result;
            if (fileApiResult.Result.ErrorCode == 0) {
                return File (fileApiResult.Content, "application/vnd.ms-excel", $"{filename}");
            } else {
                return View ("~/Views/Error/NotFound.cshtml", fileApiResult.Result.Message);
            }
        }
    }
}