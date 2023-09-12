using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert.Criteria;

public class CurrencySettingReadCriteria : CriteriaBase
{
    public int ProductId { get; set; }

    public int GroupId { get; set; }

    public int CurrencyId { get; set; }

    public int SiteId { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CurrencySettingSingleSel";

    public override bool IsValid() => true;
}