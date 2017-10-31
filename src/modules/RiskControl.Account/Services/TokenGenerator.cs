using Newtonsoft.Json;
using Olympus.DotNetCore.NapApiClient.Models;
using RiskControl.Account.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System;
using RiskControl.Account.Configuration;

namespace RiskControl.Account.Services
{
    public interface TokenGenerator
    {
        string GetToken(int onUserId, User user, FunctionLite[] functions);
    }

    public class TokenGeneratorImp : TokenGenerator
    {
        private readonly TokenProviderOptions tokenOptions;

        public TokenGeneratorImp()
        {
            tokenOptions = TokenProviderConfiguration.Options;
        }

        public string GetToken(int onUserId, User user, FunctionLite[] functions)
        {
            var claims = GetClaims(onUserId, user, functions);
            return GetJwtToken(claims);
        }

        private Claim[] GetClaims(int onUserId, User user, FunctionLite[] functions)
        {
            var functionsInJson = JsonConvert.SerializeObject(functions);
            var now = DateTime.UtcNow;
            var claims = new Claim[]
            {
                new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(now).ToString(), ClaimValueTypes.Integer64),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(NapClaimTypes.Username, user.Username),
                new Claim(NapClaimTypes.UserId, user.Id.ToString(), ClaimValueTypes.Integer),
                new Claim(NapClaimTypes.OnUserId, onUserId.ToString(), ClaimValueTypes.Integer),
                new Claim(NapClaimTypes.Functions, functionsInJson)
            };

            return claims;
        }

        private string GetJwtToken(Claim[] claims)
        {
            var jwt = new JwtSecurityToken(
                issuer: tokenOptions.Issuer,
                audience: tokenOptions.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.Add(tokenOptions.Expiration),
                signingCredentials: tokenOptions.SigningCredentials);

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

        private static long ToUnixEpochDate(DateTime date) => new DateTimeOffset(date).ToUniversalTime().ToUnixTimeSeconds();
    }
}

