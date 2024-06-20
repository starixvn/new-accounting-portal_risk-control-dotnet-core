using Microsoft.AspNetCore.Mvc;

namespace RiskControl.Sites.Controllers;

using System;
using System.Threading.Tasks;
using Fanex.Caching;
using Microsoft.AspNetCore.Authorization;
using ONEbook.UM.AspNetCore.Filters;

[AllowAnonymous]
[Route("Test")]
public class TestController(ICache cache) : Controller
{
    [SkipUMFilter]
    [Route("Index")]
    public ActionResult Index()
    {
        return Content("Index");

    }

    [SkipUMFilter]
    [Route("Redis")]
    public async Task<ActionResult> Redis()
    {
        var cacheItemOptions = new CacheItemOptions();
        cacheItemOptions.SetAbsoluteExpiration(DateTimeOffset.Now.AddHours(1));
        await cache.SetAsync("TestRedis", DateTimeOffset.Now.ToString(), cacheItemOptions);

        var (_, cacheValue) = await cache.TryGetAsync<string>("TestRedis");
        
        return Content(cacheValue);
    }


}