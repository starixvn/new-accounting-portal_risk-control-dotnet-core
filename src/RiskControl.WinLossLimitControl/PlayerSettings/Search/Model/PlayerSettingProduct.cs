using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;

public class PlayerSettingProduct
{
    public int ProductId { get; set; }

    public string ProductName { get; set; }

    public List<PlayerSetting> PlayerSettings { get; set; }
}