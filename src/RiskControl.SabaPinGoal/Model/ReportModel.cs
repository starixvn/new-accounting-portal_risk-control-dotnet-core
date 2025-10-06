namespace RiskControl.SabaPinGoal.Model;

public class ReportModel
{
    public IEnumerable<GroupModel> Statistics { get; set; } = [];

    public BaseRawStatisticModel GrandTotal { get; set; } = new();
}

public class ReportGroupModel
{
    public IEnumerable<ReportModel> Statistics { get; set; } = [];

    public BaseRawStatisticModel GrandTotal { get; set; } = new();
}