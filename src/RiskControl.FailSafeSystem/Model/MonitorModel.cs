namespace RiskControl.FailSafeSystem.Model;

public class MonitorModel
{
    public string ProductName { get; set; }

    public string GameTypeName { get; set; }

    public string Members { get; set; }

    public int ConstantKey { get; set; }

    public string RuleTitle { get; set; }

    public int RuleMemberLimit { get; set; }

    public string ReachedRule { get; set; }

    public DateTime ReachedTime { get; set; }

    public bool EnableLetstalk { get; set; }
}