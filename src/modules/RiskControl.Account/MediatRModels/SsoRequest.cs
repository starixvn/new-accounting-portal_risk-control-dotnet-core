using System;
using MediatR;

namespace RiskControl.Account.MediatRModels
{
    public class SsoRequest: IRequest<LoginResponse>
    {
        public string UserId { get; set; }
        
        public string OnUserId { get; set; }

        public string Time { get; set; }

        public Uri RedirectUrl { get; set; }
    }
}