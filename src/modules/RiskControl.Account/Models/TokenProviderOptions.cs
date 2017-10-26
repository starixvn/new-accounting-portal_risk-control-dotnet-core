using Microsoft.IdentityModel.Tokens;
using System;
using System.Text;

namespace RiskControl.Account.Models
{
    public static class TokenProviderOptions
    {
        static TokenProviderOptions()
        {
            Issuer = "NAP-Risk-Control";
            Audience = "NAP-Risk-Control-API";
            Expiration = TimeSpan.FromHours(24);

            const string SecretKey = "NAP-Risk-Control-Secret-Key";
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));
            SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        }

        public static string Issuer { get; }

        public static string Audience { get; }

        public static TimeSpan Expiration { get; }

        public static SigningCredentials SigningCredentials { get; }
    }
}
