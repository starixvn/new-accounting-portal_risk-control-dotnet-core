using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

namespace RiskControl.Account.Models
{
    public class TokenProviderOptions
    {
        public string Issuer { get; set; }

        public string Audience { get; set; }

        public int ExpirationInMinute { get; set; }

        public TimeSpan Expiration
        {
            get
            {
                return TimeSpan.FromMinutes(ExpirationInMinute);
            }
        }

        public string SecretKey { get; set; }

        public SigningCredentials SigningCredentials { get; set; }
    }
}
