namespace RiskControl.SabaPinGoal.Model;

public class DailyGroupModel
{
    public string GroupName { get; set; }

    public List<BaseRawStatisticModel> DailyStatistics { get; set; } = [];
}