using Fanex.NAP.Client.Helpers.Web;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace RiskControl.Sites.ViewComponents
{
    public class MenuViewComponent : ViewComponent
    {
        private readonly INapSession napSession;

        public MenuViewComponent(INapSession napSession)
        {
            this.napSession = napSession;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var model = napSession.MenuItemList;
            return await Task.FromResult(View(model));
        }
    }
}
