using RiskControl.Account.Models;

namespace RiskControl.Account.MediatRModels
{
    public class LoginResponse
    {
        public string Token { get; set; }

        public string Username { get; set; }

        public Menu[] Menus { get; set; }

        public Function[] Functions { get; set; }
    }
}
