using Microsoft.AspNetCore.Mvc;
using RiskControl.Results;
using RiskControl.SabaPinGoal.Model;
using RiskControl.SabaPinGoal.Service;

namespace RiskControl.SabaPinGoal.Controller;

[ApiController]
[Route("api/saba-pingoal/hourly")]
public class HourlyController(HourlyService service, ExcelReportBuilderService excelService) : ControllerBase
{
    [Route("data")]
    [HttpPost]
    public async Task<IActionResult> GetData(QueryModel queryModel)
    {
        var data = await service.CalculateHourlyReport(queryModel);
        return Ok(data);
    }

    [Route("excel")]
    [HttpPost]
    public async Task<IActionResult> Excel(QueryModel queryModel)
    {
        var data = await service.CalculateHourlyReport(queryModel);
        var excelPackage = excelService.CreateExcelPackage(data, queryModel.FromDate);
        return new EpplusExcelResult(excelPackage);
    }
}