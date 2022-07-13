using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using RiskControl.Core.BalanceUp;

namespace RiskControl.Application.BalanceUp
{
    [ApiController]
    public class BalanceUpController : ControllerBase
    {
        private readonly BalanceUpService balanceUpService;

        public BalanceUpController(BalanceUpService balanceUpService)
        {
            this.balanceUpService = balanceUpService;
        }

#if DEBUG

        [AllowAnonymous]
#endif
        [Route("api/application/balance-up")]
        public ViewModel Index()
        {
            return new ViewModel
            {
                Today = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day),
                BalanceUpRange = balanceUpService.Query()
            };
        }
    }
}
