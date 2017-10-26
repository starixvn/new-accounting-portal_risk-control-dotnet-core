using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Account.MediatRModels;
using System.Net;
using System.Threading.Tasks;

namespace RiskControl.Account.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        private readonly IMediator mediator;

        public AccountController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        [HttpPost]
        [Route("api/[controller]/login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            return await Action(request);
        }       

        [HttpPost]
        [Route("api/[controller]/password")]
        public async Task<IActionResult> Password(PasswordRequest request)
        {
            return await Action(request);
        }

        [HttpPost]
        [Route("api/[controller]/refresh")]
        [Authorize]
        public async Task<IActionResult> Refresh()
        {
            return await Action(new RefreshRequest());
        }

        private async Task<IActionResult> Action<T>(IRequest<T> request)
        {
            if (ModelState.IsValid)
            {
                var response = await mediator.Send(request).ConfigureAwait(false);
                return Json(response);
            }

            return StatusCode((int)HttpStatusCode.BadRequest);
        }
    }
}
