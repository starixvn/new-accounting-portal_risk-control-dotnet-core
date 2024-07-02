using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.SavedFilter.Criteria;

public class SavedFilterCriteria: CriteriaBase, INonQueryCommand
{
    public int QueryId { get; set; }

    public string QueryName { get; set; }

    public byte Action { get; set; }

    public int UserId { get; set; }

    public int ReportId { get; set; }

    public string ReportName { get; set; }

    public string Content { get; set; }

    public override string GetSettingKey() => "Acc_Rpt_ReportSavedFilter";

    public override bool IsValid() => true;
}