using Fanex.Data;
using Fanex.Data.Repository;

namespace RiskControl.SabaPinGoal.Criteria;

public class BaseStatisticCriteria: CriteriaBase
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public string SportBetType { get; set; }

    public string UserName { get; set; }

    public bool ExcludeTest { get; set; }

    public string Site { get; set; }

    public string LeagueGroup { get; set; }

    public string Currency { get; set; }

    public string Device { get; set; }

    public bool IsExactly { get; set; }

    [SpParam(Ignored = true)]
    public string ReportBy { get; set; }

    public override string GetSettingKey() => $"Acc_Rpt_SabaPingoal_{ReportBy}";

    public override bool IsValid() => true;
}