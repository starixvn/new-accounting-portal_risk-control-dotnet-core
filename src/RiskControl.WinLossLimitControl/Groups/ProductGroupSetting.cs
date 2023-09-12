using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.Groups;

public class ProductGroupSetting
{
    public int ProductId { get; set; }

    public string ProductName { get; set; }

    public List<GroupBetTypeSetting> Groups { get; set; }
}