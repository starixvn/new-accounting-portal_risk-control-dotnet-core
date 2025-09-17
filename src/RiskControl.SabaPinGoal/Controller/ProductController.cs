using Microsoft.AspNetCore.Mvc;
using RiskControl.Results;
using RiskControl.SabaPinGoal.Constants;
using RiskControl.SabaPinGoal.Criteria;
using RiskControl.SabaPinGoal.Model;
using RiskControl.SabaPinGoal.Service;

namespace RiskControl.SabaPinGoal.Controller;

[ApiController]
[Route("api/saba-pingoal/product")]
public class ProductController(GridService service): ControllerBase
{
    [Route("data")]
    [HttpPost]
    public async Task<IActionResult> GetData(QueryModel queryModel)
    {
        var data = await service.GetData<ProductSportCriteria>(queryModel);
        return Ok(data);
    }

    [Route("excel")]
    [HttpPost]
    public async Task<IActionResult> Excel(QueryModel queryModel)
    {
        var data = await service.GetData<ProductSportCriteria>(queryModel);
        return new FanexExcelResult(data, SheetNameConstant.SHEETNAME);
    }

    [Route("league/data")]
    [HttpPost]
    public async Task<IActionResult> GetLeagueData(QueryModel queryModel)
    {
        var data = await service.GetData<ProductLeagueCriteria>(queryModel);
        return Ok(data);
    }

    [Route("league/excel")]
    [HttpPost]
    public async Task<IActionResult> ExcelForLeague(QueryModel queryModel)
    {
        var data = await service.GetData<ProductLeagueCriteria>(queryModel);
        return new FanexExcelResult(data, SheetNameConstant.SHEETNAME);
    }
}