namespace RiskControl.Attributes;

using System;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Interface)]
public sealed class ValidationActionFilterAttribute : ActionFilterAttribute
{
    public override void OnActionExecuting(ActionExecutingContext actionContext)
    {
        if (!actionContext.ModelState.IsValid)
        {
            actionContext.Result = new StatusCodeResult(StatusCodes.Status500InternalServerError);
        }
    }
}
