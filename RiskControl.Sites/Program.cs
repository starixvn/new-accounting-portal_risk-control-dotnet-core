using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.Sites;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using RiskControl.Sites.Extensions;
using Fanex.Data;
using Fanex.Logging.Sentry.RavenClient;
using Fanex.NAP.Client;
using Fanex.NAP.Client.Attributes;
using ONEbook.UM.DependencyInjection;
using ONEbook.UM.Filters;
using RiskControl.WinLossLimitControl.Services;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;

services.AddNapAuthentication(configuration);
services.AddControllersWithViews(options =>
{
    options.Filters.Add(new ServiceFilterAttribute(typeof(CheckUMFilterAttribute)));
    options.Filters.Add(new SessionAuthorizeAttribute());
}).AddNewtonsoftJson();
services.AddNapClient(configuration);
services.AddHttpContextAccessor();
services.AddRemotingRef(configuration);
services.AddFanexData(configuration);
services.AddFanexLogSentry(configuration);
services.AddInternalServices();
services.AddAssemblyForMediatR();
services.AddOneBookUmForWeb(configuration);
services.AddHostedService<CacheBackgroundService>();

var app = builder.Build();
app.Use((context, next) =>
{
    context.Request.PathBase = new PathString(configuration.GetSection("PathBase").Value);
    return next();
});
app.UseDeveloperExceptionPage();
app.UseHttpsRedirection();
app.ConfigureExceptionHandler();
app.UseStaticFiles();
app.UseCookiePolicy();
app.UseSession();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    "default",
    "{controller=Home}/{action=Index}/{id?}");

await app.RunAsync();