using Fanex.Data.SqlServer;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.Sites;
using Fanex.NAP.SignIn.Attribute;
using Microsoft.AspNetCore.Mvc;
using ONEbook.UM.AspNetCore.Filters;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client;
using Microsoft.AspNetCore.Http;
using RiskControl.Sites.Extensions;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;

services.RegisterAuthentication(configuration);
services.AddControllersWithViews(options =>
{
    options.Filters.Add(new ServiceFilterAttribute(typeof(CheckUMFilterAttribute)));
    options.Filters.Add(new SessionAuthorizeAttribute());
}).AddNewtonsoftJson();
services.AddHttpContextAccessor();
services.RegisterRemotingRef(configuration);
services.AddFanexSql(configuration);
services.RegisterSentry(configuration);
services.RegisterInternalServices(configuration);
services.RegisterAssemblyForMediatR();

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
NapClientManager
    .UseConfig(app.Services.GetService<INapSettings>())
    .UseSession(app.Services.GetService<INapSession>());
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    "default",
    "{controller=Home}/{action=Index}/{id?}");

app.Run();