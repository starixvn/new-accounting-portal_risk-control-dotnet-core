using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Newtonsoft.Json.Linq;

namespace RiskControl.Sites
{
    public partial class Startup
    {
        private void ConfigureAuth(IServiceCollection services)
        {
            var secretKey = Configuration["TokenProviderOptions:SecretKey"];
            var issuer = Configuration["TokenProviderOptions:Issuer"]; ;
            var audience = Configuration["TokenProviderOptions:Audience"];

            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = signingKey,
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(o =>
            {
                o.Audience = Configuration["TokenProviderOptions:Audience"];
                o.TokenValidationParameters = tokenValidationParameters;
                o.Events = new JwtBearerEvents()
                {
                    OnAuthenticationFailed = c =>
                    {
                        c.NoResult();

                        c.Response.StatusCode = 500;
                        c.Response.ContentType = "text/plain";
                        // if (Environment.IsDevelopment())
                        // {
                        //     return c.Response.WriteAsync(c.Exception.ToString());
                        // }
                        // return c.Response.WriteAsync("An error occurred processing your authentication.");
                        return c.Response.WriteAsync(c.Exception.ToString() + "Jacob");
                    }
                };
            });
        }
    }
}
