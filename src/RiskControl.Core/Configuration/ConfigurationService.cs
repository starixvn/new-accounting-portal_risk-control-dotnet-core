using Microsoft.Extensions.Configuration;
using System;

namespace RiskControl.Core.Configuration
{
    public interface ConfigurationService
    {
        string FraudSystemAPI { get; }

        string CurrentDirectory { get; }

        string FileServerDirectory { get; }

        string FileServerUsername { get; }

        string ProgressiveJackpotAPI { get; }

        string FraudSystemCTSAPI { get; }
    }

    public class ConfigurationServiceImp : ConfigurationService
    {
        private readonly IConfiguration configuration;

        public ConfigurationServiceImp(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public string FraudSystemAPI => configuration["FraudSystemAPI"];

        public string CurrentDirectory => AppDomain.CurrentDomain.BaseDirectory;

        public string FileServerDirectory => configuration["FileServerDirectory"];

        public string FileServerUsername => configuration["FileServerUserName"];

        public string ProgressiveJackpotAPI => configuration["ProgressiveJackpotAPI"];

        public string FraudSystemCTSAPI => configuration["FraudSystemCTSAPI"];
    }
}