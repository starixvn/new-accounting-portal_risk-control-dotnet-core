namespace RiskControl.SabaPinGoal.Model;

public class GroupModel
{
    public string GroupName { get; set; }

    public List<BaseRawStatisticModel> Statistics { get; set; } = [];
}