using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria;

public class ProductCriteria: CriteriaBase
{
    public override bool IsValid() => true;

    public override string GetSettingKey() => "Acc_Rpt_NonSportsStatistic_ProductSel";
}