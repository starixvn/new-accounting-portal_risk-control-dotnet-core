using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.Sites.ViewComponents;

public class MenuViewComponent(INapSession napSession) : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync()
    {
        var model = napSession.MenuItemList ?? new List<MenuItem>();
        return await Task.FromResult(View(model));
    }
}