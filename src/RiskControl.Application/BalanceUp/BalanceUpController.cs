using System;
using RiskControl.BalanceUp;

namespace RiskControl.Application.BalanceUp;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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