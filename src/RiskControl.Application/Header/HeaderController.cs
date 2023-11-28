using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace RiskControl.Application.Header;

public class HeaderController(INapSession napSession) : ControllerBase
{
    [Route("state-api/application/header")]
    public Header Index()
    {
        var sessionMenus = napSession.MenuItemList ?? new List<MenuItem>();
        var menus = GetMenus(sessionMenus);
        return new Header
        {
            Username = napSession.UserName,
            Menus = menus
        };
    }

    private static List<Menu> GetMenus(IList<MenuItem> menus)
    {
        return menus.Where(m => m.ParentId <= 0)
            .OrderBy(m => m.DisplayOrder)
            .Select(m => new Menu
            {
                Id = m.Id,
                Name = m.Name,
                Link = m.Url,
                Children = GetChildrenMenus(menus, m.Id)
            })
            .ToList();
    }

    private static List<Menu> GetChildrenMenus(IEnumerable<MenuItem> menus, int parentMenuId)
    {
        return menus.Where(x => x.ParentId == parentMenuId)
            .OrderBy(m => m.DisplayOrder)
            .Select(m => new Menu
            {
                Id = m.Id,
                Name = m.Name,
                Link = m.Url
            })
            .ToList();
    }
}