using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Search;

public class SettingSite
{
    public string ProductName { get; set; }

    public string CurrencyName { get; set; }

    public string SiteName { get; set; }

    public List<SettingGroup> Groups { get; set; }

    public bool IsSuspendedAccount { get; set; }    

}