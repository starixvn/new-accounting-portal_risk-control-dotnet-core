using System.Text;
using Microsoft.IdentityModel.Tokens;
using RiskControl.Account.Common;
using RiskControl.Account.Models;

namespace RiskControl.Account.Configuration
{
    public static class  TokenProviderConfiguration
    {
        public static TokenProviderOptions Options { get; private set;}

        public static void Configure(TokenProviderOptions options) 
        {
            Check.Argument.IsNotEmpty(options.Audience, "options.Audience");
            Check.Argument.IsNotEmpty(options.Issuer, "options.Issuer");
            Check.Argument.IsNotEmpty(options.SecretKey, "options.SecretKey");
            Check.Argument.IsNotNegativeOrZero(options.ExpirationInMinute, "options.ExpirationInMinute");
            
             var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(options.SecretKey));
            options.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            Options = options;
        }
    }
}
