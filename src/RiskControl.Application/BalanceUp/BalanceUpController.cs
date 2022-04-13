using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RiskControl.Application.BalanceUp
{
    public class BalanceUpController : ControllerBase
    {
        //private readonly BalanceUpService balanceUpService;

        public BalanceUpController()
        {
            //this.balanceUpService = balanceUpService;
        }

#if DEBUG

        [AllowAnonymous]
#endif
        [Route("api/application/balance-up")]
        public static ViewModel Index()
        {
            return new ViewModel
            {
                Today = new DateTime(DateTime.Today.Year, DateTime.Today.Month, DateTime.Today.Day),
                //BalanceUpRange = balanceUpService.Query()
            };
        }
    }
}
