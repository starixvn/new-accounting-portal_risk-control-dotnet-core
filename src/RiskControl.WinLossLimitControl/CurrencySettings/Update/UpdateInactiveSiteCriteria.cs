using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update;

public class UpdateInactiveSiteCriteria : CriteriaBase, INonQueryCommand
{
    public int ProductId { get; set; }

    public int GroupId { get; set; }

    public int LevelId { get; set; }

    public decimal MaxWinLimit { get; set; }

    public int ExchangeID { get; set; }

    public bool IsBlockedPlaceBet { get; set; }

    public bool IsBlockedTransfer { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CurrencySettingInactiveSiteUpd";

    public override bool IsValid() => true;
}