namespace RiskControl.SabaPinGoal.Model;

public class DailyReportModel
{
    public IEnumerable<BaseRawStatisticModel> Statistics { get; set; } = [];

    public BaseRawStatisticModel GrandTotal { get; set; } = new();
}