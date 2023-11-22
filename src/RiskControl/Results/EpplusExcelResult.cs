namespace RiskControl.Results;

using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

public class EpplusExcelResult(ExcelPackage excelPackage, string password = "") : IActionResult
{
    public ExcelPackage ExcelPackage { get; } = excelPackage;

    public string FileName { get; set; } = "Excel.xlsx";

    public async Task ExecuteResultAsync(ActionContext context)
    {
        HttpResponseMessage response;
        using (ExcelPackage)
        {
            var bytes = await ExcelPackage.GetAsByteArrayAsync(password);
            response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(bytes)
            };
        }

        response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/vnd.ms-excel");
        response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
        {
            FileName = FileName
        };

        await response.Content.CopyToAsync(context.HttpContext.Response.Body);
    }
}
