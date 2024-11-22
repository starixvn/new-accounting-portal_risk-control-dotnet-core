namespace RiskControl.FailSafeSystem.Model;

public class RuleTitleModel
{
    public int ConstantKey { get; set; }

    public string RuleTitle { get; set; }

    public bool Checked { get; set; } = true;
}