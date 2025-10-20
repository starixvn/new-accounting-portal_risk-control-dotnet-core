using Microsoft.AspNetCore.Mvc;
using RiskControl.Results;
using RiskControl.SabaPinGoal.Constants;
using RiskControl.SabaPinGoal.Criteria;
using RiskControl.SabaPinGoal.Model;
using RiskControl.SabaPinGoal.Service;

namespace RiskControl.SabaPinGoal.Controller;

[ApiController]
[Route("api/saba-pingoal/top20")]
public class Top20Controller(GridService service) : ControllerBase
{
    [Route("data")]
    [HttpPost]
    public async Task<IActionResult> GetData(QueryModel queryModel)
    {
        var data = await service.GetDataWithGroup<Top20Criteria>(queryModel);
        return Ok(data);
    }

    [Route("excel")]
    [HttpPost]
    public async Task<IActionResult> Excel(QueryModel queryModel)
    {
        var data = await service.GetDataWithGroup<Top20Criteria>(queryModel);
        return new FanexExcelResult(data, SheetNameConstant.SHEETNAME);
    }

    [Route("data-with-drilldown")]
    [HttpPost]
    public async Task<IActionResult> GetDataWithDrillDown(QueryModel queryModel)
    {
        var data = await service.GetData<Top20Criteria>(queryModel);
        return Ok(data);
    }

    [Route("excel-with-drilldown")]
    [HttpPost]
    public async Task<IActionResult> ExcelWithDrillDown(QueryModel queryModel)
    {
        var data = await service.GetData<Top20Criteria>(queryModel);
        return new FanexExcelResult(data, SheetNameConstant.SHEETNAME);
    }
}