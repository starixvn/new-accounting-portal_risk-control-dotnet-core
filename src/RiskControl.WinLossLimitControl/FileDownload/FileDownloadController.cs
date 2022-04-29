using System;
using System.IO;
using System.Text;
using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.WinLossLimitControl.FileDownload
{
    [Route("WinLimitControl/FileDownload")]
    public class FileDownloadController : Controller
    {
        private readonly FileContentService fileContentService;

        public FileDownloadController(FileContentService fileContentService)
        {
            this.fileContentService = fileContentService;
        }

        [NapAuth(FunctionKey = FunctionKeys.WinLimitControl, Policy = Constant.Policy.Read)]
        [Route("Index")]
        public ActionResult Index(string hash)
        {
            var base64EncodedBytes = Convert.FromBase64String(hash);
            var filename = Encoding.UTF8.GetString(base64EncodedBytes);
            var model = new FileDownloadModel { FileName = filename };

            return View(model);
        }

        [NapAuth(FunctionKey = FunctionKeys.WinLimitControl, Policy = Constant.Policy.Read)]
        [Route("Excel")]
        public ActionResult Excel(string filename)
        {
            try
            {
                var fileContents = fileContentService.ReadAllBytes(filename);
                return File(fileContents, "application/vnd.ms-excel", $"{filename}");
            }
            catch (FileNotFoundException)
            {
                return View("NotFound");
            }
        }
    }
}