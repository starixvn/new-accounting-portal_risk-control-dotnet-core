using Fanex.Data;
using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Filter.Criteria;

public class CustomerSuggestionCriteria : CriteriaBase
{
    [SpParam(SqlParamName = "custname")]
    public string CustomerName { get; set; }

    public override string GetSettingKey() => "NAP_WinLimit_CustSuggestionSel";

    public override bool IsValid() => true;
}