using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Update;

public class UpdateCriteria : CriteriaBase, INonQueryCommand
{
    public int CustId { get; set; }

    public int ProductId { get; set; }

    public int GroupId { get; set; }

    public int LevelId { get; set; }

    public decimal MaxWinLimit { get; set; }

    public int UserId { get; set; }

    public string IP { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CustSettingUpd";

    public override bool IsValid() => true;
}