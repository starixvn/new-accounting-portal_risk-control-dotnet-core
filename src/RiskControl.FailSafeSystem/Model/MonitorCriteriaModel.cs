namespace RiskControl.FailSafeSystem.Model;

public class MonitorCriteriaModel
{
    public int RuleId { get; set; }

    public string CriteriaName { get; set; }

    public string CriteriaValue { get; set; }

    public string PostFix { get; set; }
}