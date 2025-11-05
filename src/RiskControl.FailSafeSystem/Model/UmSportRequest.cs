namespace RiskControl.FailSafeSystem.Model;

public class UmSportRequest
{
    public string Timestamp => $"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff tt}";

    public string Seq { get; set; }

    public int SportTypeId { get; set; }

    public string StartTime { get; } = DateTime.UtcNow.ToString("2025-01-01 12:12:00");

    public string EndTime { get; } = DateTime.UtcNow.ToString("2099-01-01 12:12:00");
}