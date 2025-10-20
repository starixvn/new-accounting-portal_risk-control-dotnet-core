namespace RiskControl.SabaPinGoal.Criteria;

public class CurrencyCriteria: BaseStatisticCriteria
{
    public int DrillDownCurrency { get; set; }

    public bool IsGrandTotal { get; set; }
}