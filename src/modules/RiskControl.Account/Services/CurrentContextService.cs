using System;
using System.Globalization;
using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Http;
using UAParser;

namespace RiskControl.Account.Services
{
    public interface CurrentContextService
    {
        string GetIP();

        string GetDomainName();

        string GetBrowserName();

        string GetPlatform();

        string GetCountryCode();
    }

    public class CurrentContextServiceImp : CurrentContextService
    {
        private readonly HttpContext context;

        public CurrentContextServiceImp(IHttpContextAccessor httpContextAccessor)
        {
            this.context = httpContextAccessor.HttpContext;
        }

        public string GetIP()
        {
            return context.Connection.RemoteIpAddress.ToString();
        }

        public string GetDomainName()
        {
            return context.Request.Host.Value;
        }

        public string GetBrowserName()
        {
            var userAgentString = context.Request.Headers["User-Agent"].ToString();
            var uaParser = Parser.GetDefault();
            var client = uaParser.Parse(userAgentString);
            var userAgent = client.UserAgent;

            return $"{userAgent.Family}/{userAgent.Major}.{userAgent.Minor}";
        }

        public string GetPlatform()
        {
            return context.Request.Headers["User-Agent"].ToString();
        }

        public string GetCountryCode()
        {
            var regionInfo = ResolveCountry(context.Request);

            return regionInfo == null ? null : regionInfo.GeoId.ToString(CultureInfo.CurrentCulture);
        }

        private RegionInfo ResolveCountry(HttpRequest request)
        {
            var culture = ResolveCulture(request);

            if (culture != null)
            {
                return new RegionInfo(culture.LCID);
            }

            return null;
        }

        private CultureInfo ResolveCulture(HttpRequest request)
        {
            var userLangs = request.Headers["Accept-Language"].ToString();
            var firstLang = userLangs.Split(',').FirstOrDefault();
            var language = string.IsNullOrEmpty(firstLang) ? "en" : firstLang;

            try
            {
                return CultureInfo.CreateSpecificCulture(language);
            }
            catch (ArgumentException)
            {
                return null;
            }
        }
    }
}