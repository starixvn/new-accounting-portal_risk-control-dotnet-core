using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Olympus.DotNetCore.Maintenance;
using Olympus.DotNetCore.NapApiClient.Models;
using RiskControl.Account.Models;

namespace RiskControl.Account.Services {
    public interface TokenGenerator {
        string GetToken (int onUserId, User user, FunctionLite[] functions, Claim maintenanceClaim);
    }

    public class TokenGeneratorImp : TokenGenerator {
        private readonly IOptions<TokenProviderOptions> tokenOptions;

        public TokenGeneratorImp (IOptions<TokenProviderOptions> options, MaintenanceServiceFactory maintenanceServiceFactory) {
            tokenOptions = options;
        }

        public string GetToken (int onUserId, User user, FunctionLite[] functions, Claim maintenanceClaim) {
            var claims = GetClaims (onUserId, user, functions);
            if (maintenanceClaim != null) {
                claims.Add (maintenanceClaim);
            }

            return GetJwtToken (claims);
        }

        private List<Claim> GetClaims (int onUserId, User user, FunctionLite[] functions) {
            var functionsInJson = JsonConvert.SerializeObject (functions);
            var now = DateTime.UtcNow;
            var claims = new List<Claim> {
                new Claim (JwtRegisteredClaimNames.Iat, ToUnixEpochDate (now).ToString (), ClaimValueTypes.Integer64),
                new Claim (JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim (NapClaimTypes.Username, user.Username),
                new Claim (NapClaimTypes.UserId, user.Id.ToString (), ClaimValueTypes.Integer),
                new Claim (NapClaimTypes.OnUserId, onUserId.ToString (), ClaimValueTypes.Integer),
                new Claim (NapClaimTypes.Functions, functionsInJson)
            };

            return claims;
        }

        private string GetJwtToken (List<Claim> claims) {
            var jwt = new JwtSecurityToken (
                issuer: tokenOptions.Value.Issuer,
                audience: tokenOptions.Value.Audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.Add (tokenOptions.Value.Expiration),
                signingCredentials : tokenOptions.Value.SigningCredentials);

            return new JwtSecurityTokenHandler ().WriteToken (jwt);
        }

        private static long ToUnixEpochDate (DateTime date) => new DateTimeOffset (date).ToUniversalTime ().ToUnixTimeSeconds ();
    }
}