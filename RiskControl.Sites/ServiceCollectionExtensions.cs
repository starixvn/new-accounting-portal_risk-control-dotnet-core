using AutoMapper;
using Fanex.RemotingRef;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.Sites.AutoMapperProfiles.BettingMonitoring;
using RiskControl.Sites.AutoMapperProfiles.FailSafeSystem;
using RiskControl.Sites.AutoMapperProfiles.NonSports;
using RiskControl.Sites.AutoMapperProfiles.WinLossLimitControl;
using RiskControl.Sites.DependencyInjections;
using System;
using System.Threading.Tasks;
using RiskControl.Sites.AutoMapperProfiles.SabaPinGoal;

namespace RiskControl.Sites;

using BettingMonitoring.Query;
using Microsoft.AspNetCore.DataProtection;
using ProgressiveJackpot;
using RiskControl.NonSportsGamesStatistics.CurrencyView.Main;
using StackExchange.Redis;
using System.Reflection;
using WinLossLimitControl.PlayerSettings.Insert;

public static class ServiceCollectionExtensions
{
 public static void AddRemotingRef(this IServiceCollection services, IConfiguration configuration)
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
                mc.AddProfile(new FailSafeSystemProfile());
                mc.AddProfile(new SabaPinGoalProfile());
            });

            return mapperConfig.CreateMapper();
        }
    }

    public static void AddAssemblyForMediatR(this IServiceCollection services)
    {
        services.AddMediatR(cfg => ConfigAssembly(cfg, typeof(BettingMonitoringQueryController)));
        services.AddMediatR(cfg => ConfigAssembly(cfg, typeof(CurrencyViewController)));
        services.AddMediatR(cfg => ConfigAssembly(cfg, typeof(ProgressiveJackpotController)));
        services.AddMediatR(cfg => ConfigAssembly(cfg, typeof(PlayerSettingInsertController)));
        return;

        void ConfigAssembly(MediatRServiceConfiguration configuration, Type type)
        {
            configuration.RegisterServicesFromAssemblies(type.GetTypeInfo().Assembly);
        }
    }


    public static void AddInternalServices(this IServiceCollection services)
    {
        services.RegisterGlobalServices();
        services.RegisterNonSportsServices();
        services.RegisterBetMonitoringServices();
        services.RegisterProgressiveJackpotService();
        services.RegisterWinLimitControlServices();
        services.RegisterFailSafeSystemServices();
        services.RegisterSabaPinGoalServices();
        services.AddSingleton(CreateMapper);
    }

    public static void AddNapAuthentication(this IServiceCollection services, IConfiguration configuration)
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

        var redisConfig = configuration.GetSection("AuthSettings:RedisConfig").Value;
        var redisMultiplexer = ConnectionMultiplexer.Connect(redisConfig);

        services.AddDataProtection()
            .PersistKeysToStackExchangeRedis(redisMultiplexer, "Fanex.RiskControl-ProtectionKeys");

        services.AddSingleton<IConnectionMultiplexer>(redisMultiplexer);

        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisConfig;
            options.InstanceName = "Fanex.RiskControl.Session-";
        });
    }
}