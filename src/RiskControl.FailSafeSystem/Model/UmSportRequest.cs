namespace RiskControl.FailSafeSystem.Model;

public class UmSportRequest
{
    public string Timestamp => $"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff tt}";

    public string Seq { get; set; }

    public int SportTypeId { get; set; }

    public string StartTime { get; } = DateTime.MinValue.ToString("yyyy-MM-dd HH:mm:ss");

    public string EndTime { get; } = DateTime.MaxValue.ToString("yyyy-MM-dd HH:mm:ss");
}