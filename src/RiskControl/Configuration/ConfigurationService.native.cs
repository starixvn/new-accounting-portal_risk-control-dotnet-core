namespace RiskControl.Configuration;

using System;
using Microsoft.Extensions.Configuration;

public interface ConfigurationService
{
    string FraudSystemAPI { get; }

    string CurrentDirectory { get; }

    string FileServerDirectory { get; }

    string ProgressiveJackpotAPI { get; }

    string FraudSystemCTSAPI { get; }

    string DownFileApi { get; }

    string CWLAnalysisApi { get; }

    string ExcelPassword { get; }

    string MemberWinLossFileServerDirectory { get; }
}

public class ConfigurationServiceImp(IConfiguration configuration) : ConfigurationService
{
    public string FraudSystemAPI => configuration["FraudSystemAPI"];

    public string CurrentDirectory => AppDomain.CurrentDomain.BaseDirectory;

    public string FileServerDirectory => configuration["FileServerDirectory"];

    public string ProgressiveJackpotAPI => configuration["ProgressiveJackpotAPI"];

    public string FraudSystemCTSAPI => configuration["FraudSystemCTSAPI"];

    public string DownFileApi => configuration["DownfileApi"];

    public string CWLAnalysisApi => configuration["CWLAnalysisApi"];

    public string ExcelPassword => configuration["ExcelPassword"];

    public string MemberWinLossFileServerDirectory => configuration["MemberWinLossFileServerDirectory"];
}