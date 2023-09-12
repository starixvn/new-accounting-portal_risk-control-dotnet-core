using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Update;

public class GameGroupSettingCriteria : CriteriaBase, INonQueryCommand
{
    public int ProductId { get; set; }

    public string BettypeIds { get; set; }

    public int GroupId { get; set; }

    public int UserID { get; set; }

    public string IP { get; set; }

    public override string GetSettingKey() => "NAP_Winlimit_GameGroupSettingIns";

    public override bool IsValid() => true;
}