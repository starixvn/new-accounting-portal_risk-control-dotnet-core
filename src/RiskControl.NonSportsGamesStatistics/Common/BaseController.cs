using System.Threading.Tasks;
using Fanex.Excel.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Olympus.WebApi.FanexGridExcel;

namespace RiskControl.NonSportsGamesStatistics.Common
{
    public class BaseController<TQueryModel> : ControllerBase
        where TQueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
    {
        protected readonly IMediator Mediator;

        public BaseController(IMediator mediator)
        {
            Mediator = mediator;
        }

        public virtual async Task<IActionResult> Query(TQueryModel queryModel)
        {
            var result = await Mediator.Send(queryModel).ConfigureAwait(false);
            return Ok(result);
        }

        public virtual async Task<IActionResult> Excel(TQueryModel queryModel, string sheetName)
        {
            var result = await Mediator.Send(queryModel).ConfigureAwait(false);
            return new FanexExcelResult(result, sheetName);
        }
    }
}