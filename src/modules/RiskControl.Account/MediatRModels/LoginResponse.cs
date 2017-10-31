using Olympus.DotNetCore.NapApiClient.Models;
using RiskControl.Account.Models;

namespace RiskControl.Account.MediatRModels
{
    public class LoginResponse
    {
        public string Token { get; set; }

        public string Username { get; set; }

        public MenuItem[] Menus { get; set; }

        public FunctionLite[] Functions { get; set; }
    }
}
