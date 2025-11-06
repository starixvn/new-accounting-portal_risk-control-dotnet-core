namespace RiskControl.FailSafeSystem.Model;

public class UmSportRequest
{
    public string Timestamp => $"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff tt}";

    public string Seq { get; set; }

    public int SportTypeId { get; set; }
}