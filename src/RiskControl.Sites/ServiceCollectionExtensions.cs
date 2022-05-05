using AutoMapper;
using Fanex.Data;
using Fanex.Data.SqlServer;
using Fanex.Logging;
using Fanex.Logging.Sentry;
using Fanex.RemotingRef;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using RiskControl.Sites.AutoMapperProfiles.BettingMonitoring;
using RiskControl.Sites.AutoMapperProfiles.NonSports;
using RiskControl.Sites.AutoMapperProfiles.WinLossLimitControl;
using RiskControl.Sites.DependencyInjections;
using RiskControl.Sites.Models;
using RiskControl.Sites.Services;
using Sentry;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace RiskControl.Sites
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterFanexData(this IServiceCollection services, IConfiguration configuration)
        {
            var connections = configuration.GetSection("ConnectionStrings")
                                   .GetChildren()
                                   .AsEnumerable()
                                   .ToDictionary(
                                            x => x.Key,
                                            y => new ConnectionConfiguration(y.Key, y.Value)
                                    );

            DbSettingProviderManager
                .StartNewSession()
                .Use(connections)
                .WithSqlServer()
                .UseDefaultDbSettingProvider(configuration.GetSection("StoredProcedurePath").Value)
                .Run();
        }

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

        public static void LoadConfig(this IServiceCollection services)
        {
            Directory.SetCurrentDirectory(AppDomain.CurrentDomain.BaseDirectory);

            var text = File.ReadAllText("appsettings.json");
            AppConfigService.AppConfig = JsonConvert.DeserializeObject<ConfigSettingModel>(text);
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
                    mc.AddProfile(new SpecificMemberProfile());
                    mc.AddProfile(new TopTwentyProfile());
                    mc.AddProfile(new UserNameViewProfile());
                    mc.AddProfile(new CurrencySettingProfile());
                    mc.AddProfile(new GameRoundProfile());
                    mc.AddProfile(new MonitorProfile());
                    mc.AddProfile(new PlayerSettingProfile());
                });

                return mapperConfig.CreateMapper();
            }
        }

        public static void RegisterInternalServices(this IServiceCollection services)
        {
            services.RegisterGlobalServices();
            services.RegisterNonSportsServices();
            services.RegisterBetMonitoringServices();
            services.RegisterProgressiveJackpotService();
            services.RegisterVoidRejectRefundService();
            services.RegisterWinLimitControlServices();
            services.AddSingleton(CreateMapper);
            OnebookUMInitializer.InitializeUMClientManager();
            OnebookUMInitializer.RegisterServiceCollection(services);
        }
    }
}
