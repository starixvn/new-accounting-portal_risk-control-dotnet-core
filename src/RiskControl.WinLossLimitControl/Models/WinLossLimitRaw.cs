namespace RiskControl.WinLossLimitControl.Models
{
    public interface WinLossLimitRaw
    {
        int LevelId { get; set; }

        decimal MaxWinLimit { get; set; }
    }
}