using AutoMapper;
using Fanex.Logging;
using Fanex.Logging.Sentry.RavenClient;
using Fanex.RemotingRef;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.Sites.AutoMapperProfiles.BettingMonitoring;
using RiskControl.Sites.AutoMapperProfiles.NonSports;
using RiskControl.Sites.AutoMapperProfiles.WinLossLimitControl;
using RiskControl.Sites.DependencyInjections;
using SharpRaven;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.Sites;

using System.Reflection;
using ProgressiveJackpot;
using BettingMonitoring.Query;
using NonSportsGamesStatistics.CurrencyView.Main.History;
using WinLossLimitControl.PlayerSettings.Insert;

public static class ServiceCollectionExtensions
{
    public static void RegisterSentry(this IServiceCollection services, IConfiguration configuration)
    {
        LogManager
            .SetDefaultLogCategory(configuration.GetSection("CategorySentryLog").Value)
            .Use(new List<ILogEngine>
            {
                new SentryLogging(new SentryEngineOptions
                {
                    Dsn = new Dsn(configuration.GetSection("SentryClientKey").Value)
                })
            });
    }

    public static void RegisterRemotingRef(this IServiceCollection services, IConfiguration configuration)
    {
        RefDataTypeContainer.ConnectTo(new Uri(configuration["Fanex.RemotingRef.Service.Url"]))
            .FromApplication("Risk Controls");
    }

    private static IMapper CreateMapper
    {
        get
        {
            var mapperConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new BettingMonitoringProfile());
                mc.AddProfile(new CommonProfile());
                mc.AddProfile(new CurrencyViewProfile());
                mc.AddProfile(new DailyViewProfile());
                mc.AddProfile(new HourlyProfile());
                mc.AddProfile(new TopTwentyProfile());
                mc.AddProfile(new UserNameViewProfile());
                mc.AddProfile(new CurrencySettingProfile());
                mc.AddProfile(new ManagedSettingGroupProfile());
                mc.AddProfile(new GameRoundProfile());
                mc.AddProfile(new MonitorProfile());
                mc.AddProfile(new PlayerSettingProfile());
                mc.AddProfile(new SavedFilterProfile());
                mc.AddProfile(new HeadlineProfile());
            });

            return mapperConfig.CreateMapper();
        }
    }

    public static void RegisterAssemblyForMediatR(this IServiceCollection services)
    {
        services.AddMediatR(cfg => ConfigAssembly(cfg, typeof(BettingMonitoringQueryController)));
        services.AddMediatR(cfg => ConfigAssembly(cfg, typeof(CurrencyViewHistoryModeController)));
        services.AddMediatR(cfg => ConfigAssembly(cfg, typeof(ProgressiveJackpotController)));
        services.AddMediatR(cfg => ConfigAssembly(cfg, typeof(PlayerSettingInsertController)));
        return;

        void ConfigAssembly(MediatRServiceConfiguration configuration, Type type)
        {
            configuration.RegisterServicesFromAssemblies(type.GetTypeInfo().Assembly);
        }
    }


    public static void RegisterInternalServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.RegisterGlobalServices();
        services.RegisterNonSportsServices();
        services.RegisterBetMonitoringServices();
        services.RegisterProgressiveJackpotService();
        services.RegisterWinLimitControlServices();
        services.AddSingleton(CreateMapper);
        OnebookUMInitializer.RegisterServiceCollection(services, configuration);
    }

    public static void RegisterAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.LoginPath = configuration.GetSection("AuthSettings:LoginPath").Value;
                options.LogoutPath = configuration.GetSection("AuthSettings:LogoutPath").Value;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(int.Parse(configuration.GetSection("AuthSettings:CookieTimeOut").Value));
                options.Cookie = new CookieBuilder
                {
                    Name = "RiskControl.Cookie",
                    SecurePolicy = CookieSecurePolicy.SameAsRequest
                };

                options.Events.OnSigningOut = context =>
                {
                    context.Response.Redirect(options.LoginPath);
                    return Task.CompletedTask;
                };
            });

        services.AddSession(options =>
        {
            options.Cookie.IsEssential = true;
            options.IdleTimeout = TimeSpan.FromMinutes(int.Parse(configuration.GetSection("AuthSettings:SessionTimeOut").Value));
            options.Cookie.Name = "RiskControl.Session";
        });
    }
}