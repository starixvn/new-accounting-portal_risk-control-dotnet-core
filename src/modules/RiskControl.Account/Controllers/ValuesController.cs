using Olympus.DotNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace RiskControl.Account.Controllers
{
    [Route("api/[controller]")]
    public class ValuesController : Controller
    {
        // GET: api/values
        [HttpGet]
        [Function("CWL", 1)]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
    }
}
