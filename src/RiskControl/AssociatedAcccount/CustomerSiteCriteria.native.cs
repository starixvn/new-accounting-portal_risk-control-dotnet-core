using Fanex.Data.Repository;

namespace RiskControl.AssociatedAcccount;

public class CustomerSiteCriteria : CriteriaBase
{
    public string CustIdList { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CustomerSiteByCustIdSel";

    public override bool IsValid() => true;
}