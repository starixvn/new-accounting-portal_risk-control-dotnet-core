namespace RiskControl.FailSafeSystem.Model;

public class SettingRuleModel
{
    public int ConstantKey { get; set; }

    public string RuleTitle { get; set; }

    public int ProductCount { get; set; }

    public int RuleMemberLimit { get; set; }

    public bool EnableLetstalk { get; set; }

    public bool EnableAutoDisableProduct { get; set; }

    public bool IsTest { get; set; }
}