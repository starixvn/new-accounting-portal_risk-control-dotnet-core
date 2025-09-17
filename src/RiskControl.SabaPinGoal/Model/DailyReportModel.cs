namespace RiskControl.SabaPinGoal.Model;

public class DailyReportModel
{
    public IEnumerable<DailyGroupModel> Statistics { get; set; } = [];

    public BaseRawStatisticModel GrandTotal { get; set; } = new();
}