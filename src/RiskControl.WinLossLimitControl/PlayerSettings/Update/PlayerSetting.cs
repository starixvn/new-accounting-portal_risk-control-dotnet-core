namespace RiskControl.WinLossLimitControl.PlayerSettings.Update;

public class PlayerSetting
{
    public int CustId { get; set; }

    public int ProductId { get; set; }

    public int GroupId { get; set; }

    public int LevelId { get; set; }

    public decimal MaxWinLimit { get; set; }
}