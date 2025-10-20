namespace RiskControl.SabaPinGoal.Criteria;

public class Top20Criteria : BaseStatisticCriteria
{
    public bool IsDrillDown { get; set; }

    public byte TopType { get; set; }

    public byte RoleId { get; set; }

    public string SortColumnName { get; set; }
}