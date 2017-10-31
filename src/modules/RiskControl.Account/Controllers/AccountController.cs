using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Account.MediatRModels;
using System.Net;
using System.Threading.Tasks;
using Olympus.DotNetCore.NapApiClient.Exceptions;

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

        [HttpPost]
        [Route("api/[controller]/login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            return await LoginAction(request).ConfigureAwait(false);
        }
        
        [HttpPost]
        [Route("api/[controller]/sso")]
        [AllowAnonymous]
        public async Task<IActionResult> Sso( SsoRequest request)
        {
            return await LoginAction(request).ConfigureAwait(false);
        }

        [HttpPost]
        [Route("api/[controller]/password")]
        public async Task<IActionResult> Password(PasswordRequest request)
        {
            return await LoginAction(request).ConfigureAwait(false);
        }

        private async Task<IActionResult> LoginAction<T>(IRequest<T> request)
        {
            try
            {
                return await Action(request).ConfigureAwait(false);
            }
            catch (LoginException loginException)
            {
                return StatusCode((int)HttpStatusCode.BadRequest, loginException.Message);
            }
        }

        [HttpPost]
        [Route("api/[controller]/refresh")]
        [Authorize]
        public async Task<IActionResult> Refresh()
        {
            return await Action(new RefreshRequest()).ConfigureAwait(false);
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
