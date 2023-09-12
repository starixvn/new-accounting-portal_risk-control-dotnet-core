using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.Groups;

public class GroupBetTypeSetting
{
    public string GroupName { get; set; }

    public List<string> BetTypes { get; set; }
}