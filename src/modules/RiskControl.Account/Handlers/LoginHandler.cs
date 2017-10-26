using MediatR;
using Newtonsoft.Json;
using RiskControl.Account.MediatRModels;
using RiskControl.Account.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RiskControl.Account.Handlers
{
    public class LoginHandler : IAsyncRequestHandler<LoginRequest, LoginResponse>
    {
        public Task<LoginResponse> Handle(LoginRequest message)
        {
            var token = GetToken(message.Username);
            var response = new LoginResponse
            {
                Username = message.Username,
                Token = token,
            };

            return Task.FromResult(response);
        }

        private static string GetToken(string username)
        {
            var claims = GetClaims(username);
            return GetJwtToken(claims);
        }

        private static Claim[] GetClaims(string username)
        {
            var now = DateTime.UtcNow;
            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(now).ToString(), ClaimValueTypes.Integer64),
                new Claim(JwtRegisteredClaimNames.UniqueName, username),
                new Claim(NapClaimTypes.Username, username),
                new Claim(NapClaimTypes.UserId, "15", ClaimValueTypes.Integer),
                new Claim(NapClaimTypes.Functions, GetClaimedFunctions())
            };

            return claims;
        }

        private static string GetJwtToken(Claim[] claims)
        {
            var jwt = new JwtSecurityToken(
                issuer: TokenProviderOptions.Issuer,
                audience: TokenProviderOptions.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.Add(TokenProviderOptions.Expiration),
                signingCredentials: TokenProviderOptions.SigningCredentials);

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        private static long ToUnixEpochDate(DateTime date) => new DateTimeOffset(date).ToUniversalTime().ToUnixTimeSeconds();

        private static string GetClaimedFunctions()
        {
            var functions = new Function[] 
            {
                new Function("CWL", 2)
            };

            return JsonConvert.SerializeObject(functions);
        }
    }
}
