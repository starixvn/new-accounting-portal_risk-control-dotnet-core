using System;
using Fanex.Data;
using Fanex.Data.OldConnectionStringProvider;
using Fanex.Data.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Olympus.DotNetCore.NapApiClient.Configuration;

namespace RiskControl.Sites {
    public partial class Startup {
        private void ConfigureGlobalServices (IServiceCollection services) {
            services.AddScoped<IDynamicRepository, DynamicRepository> ();
        }

        private void ConfigureFanexData (IApplicationBuilder application) {
            using (var serviceScope = application.ApplicationServices.CreateScope ()) {
                var napApiOptions = serviceScope.ServiceProvider.GetService<IOptions<NapApiOptions>> ();
                var environment = napApiOptions.Value.Environment;
                var resourceFolder = environment == "PRO" || environment == "MNL" || environment == "MASTER" ?
                    "LIVE" :
                    "TEST";
            }
        }
    }
}