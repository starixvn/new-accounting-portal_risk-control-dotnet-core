using Microsoft.AspNetCore.Mvc;
using RiskControl.Results;
using RiskControl.SabaPinGoal.Constants;
using RiskControl.SabaPinGoal.Criteria;
using RiskControl.SabaPinGoal.Model;
using RiskControl.SabaPinGoal.Service;

namespace RiskControl.SabaPinGoal.Controller;

[ApiController]
[Route("api/saba-pingoal/company")]
public class CompanyController(GridService service) : ControllerBase
{
    [Route("data")]
    [HttpPost]
    public async Task<IActionResult> GetData(QueryModel queryModel)
    {
        var data = await service.GetDataWithGroup<CompanyDataCriteria>(queryModel);
        return Ok(data);
    }

    [Route("data-with-drilldown")]
    [HttpPost]
    public async Task<IActionResult> GetDataWithDrillDown(QueryModel queryModel)
    {
        var data = await service.GetData<CompanyDataCriteria>(queryModel);
        return Ok(data);
    }

    [Route("excel")]
    [HttpPost]
    public async Task<IActionResult> Excel(QueryModel queryModel)
    {
        var data = await service.GetDataWithGroup<CompanyDataCriteria>(queryModel);
        return new FanexExcelResult(data, SheetNameConstant.SHEETNAME);
    }

    [Route("excel-with-drilldown")]
    [HttpPost]
    public async Task<IActionResult> ExcelWithDrillDown(QueryModel queryModel)
    {
        var data = await service.GetData<CompanyDataCriteria>(queryModel);
        return new FanexExcelResult(data, SheetNameConstant.SHEETNAME);
    }
}