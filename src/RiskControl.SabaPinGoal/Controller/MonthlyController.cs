using Microsoft.AspNetCore.Mvc;
using RiskControl.Results;
using RiskControl.SabaPinGoal.Constants;
using RiskControl.SabaPinGoal.Criteria;
using RiskControl.SabaPinGoal.Model;
using RiskControl.SabaPinGoal.Service;

namespace RiskControl.SabaPinGoal.Controller;

[ApiController]
[Route("api/saba-pingoal/monthly")]
public class MonthlyController(GridService service) : ControllerBase
{
    [Route("data")]
    [HttpPost]
    public async Task<IActionResult> GetData(QueryModel queryModel)
    {
        var data = await service.GetData<ReportCriteria>(queryModel);
        return Ok(data);
    }

    [Route("excel")]
    [HttpPost]
    public async Task<IActionResult> Excel(QueryModel queryModel)
    {
        var data = await service.GetData<ReportCriteria>(queryModel);
        return new FanexExcelResult(data, SheetNameConstant.SHEETNAME);
    }
}