using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.Sites;
using Microsoft.AspNetCore.Mvc;
using ONEbook.UM.AspNetCore.Filters;
using Microsoft.AspNetCore.Http;
using RiskControl.Sites.Extensions;
using Fanex.Data;
using Fanex.NAP.Client.Attributes;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;

services.RegisterAuthentication(configuration);
services.AddControllersWithViews(options =>
{
    options.Filters.Add(new ServiceFilterAttribute(typeof(CheckUMFilterAttribute)));
    options.Filters.Add(new SessionAuthorizeAttribute());
}).AddNewtonsoftJson();
services.AddNapClient(configuration);
services.AddOneBookUm(configuration);
services.AddHttpContextAccessor();
services.RegisterRemotingRef(configuration);
services.AddFanexData(configuration);
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
app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    "default",
    "{controller=Home}/{action=Index}/{id?}");

await app.RunAsync();