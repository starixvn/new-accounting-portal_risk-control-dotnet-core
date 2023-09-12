namespace RiskControl.BettingMonitoring.Models;

public class BettingMonitoringModel
{
    public int MinimumTickets { get; set; }

    public int Threshold { get; set; }

    public int UserId { get; set; }

    public override bool Equals(object obj)
    {
        var betMonitoring = obj as BettingMonitoringModel;

        return Equals(MinimumTickets, betMonitoring.MinimumTickets) &&
               Equals(Threshold, betMonitoring.Threshold);
    }

    public override int GetHashCode()
    {
        return 0;
    }
}