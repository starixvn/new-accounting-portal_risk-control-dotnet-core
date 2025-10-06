namespace RiskControl.SabaPinGoal.Model;

public class HourlyStatisticsAccumulatedModel
{
    public List<HourlyStatistics> HourlyStatistics { get; set; } = [];

    public double? AveragePlayer { get; set; }
}