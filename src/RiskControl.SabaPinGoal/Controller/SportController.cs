using Microsoft.AspNetCore.Mvc;
using RiskControl.Results;
using RiskControl.SabaPinGoal.Constants;
using RiskControl.SabaPinGoal.Criteria;
using RiskControl.SabaPinGoal.Model;
using RiskControl.SabaPinGoal.Service;

namespace RiskControl.SabaPinGoal.Controller;

[ApiController]
[Route("api/saba-pingoal/sport")]
public class SportController(GridService service): ControllerBase
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

    [Route("league/data")]
    [HttpPost]
    public async Task<IActionResult> GetLeagueData(QueryModel queryModel)
    {
        var data = await service.GetData<SportLeagueCriteria>(queryModel);
        return Ok(data);
    }

    [Route("league/excel")]
    [HttpPost]
    public async Task<IActionResult> ExcelForLeague(QueryModel queryModel)
    {
        var data = await service.GetData<SportLeagueCriteria>(queryModel);
        return new FanexExcelResult(data, SheetNameConstant.SHEETNAME);
    }

    [Route("bettype/data")]
    [HttpPost]
    public async Task<IActionResult> GetBetTypeData(QueryModel queryModel)
    {
        var data = await service.GetData<SportBetTypeCriteria>(queryModel);
        return Ok(data);
    }

    [Route("bettype/excel")]
    [HttpPost]
    public async Task<IActionResult> ExcelForBetType(QueryModel queryModel)
    {
        var data = await service.GetData<SportBetTypeCriteria>(queryModel);
        return new FanexExcelResult(data, SheetNameConstant.SHEETNAME);
    }
}