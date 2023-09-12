using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;

public class PlayerSettingProduct
{
    public string ProductName { get; set; }

    public List<PlayerSetting> PlayerSettings { get; set; }
}