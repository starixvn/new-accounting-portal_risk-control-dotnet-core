using System;
using System.Configuration;

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
        public string FraudSystemAPI => ConfigurationManager.AppSettings["FraudSystemAPI"];

        public string CurrentDirectory => AppDomain.CurrentDomain.BaseDirectory;

        public string FileServerDirectory => ConfigurationManager.AppSettings["FileServerDirectory"];

        public string FileServerUsername => ConfigurationManager.AppSettings["FileServerUserName"];

        public string ProgressiveJackpotAPI => ConfigurationManager.AppSettings["ProgressiveJackpotAPI"];

        public string FraudSystemCTSAPI => ConfigurationManager.AppSettings["FraudSystemCTSAPI"];
    }
}