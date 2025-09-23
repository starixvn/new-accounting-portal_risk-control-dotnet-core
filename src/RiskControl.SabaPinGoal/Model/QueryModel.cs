using System.ComponentModel.DataAnnotations;

namespace RiskControl.SabaPinGoal.Model;

public class QueryModel
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public string SportBetType { get; set; }

    public string UserName { get; set; }

    public bool ExcludeTest { get; set; }

    public string Site { get; set; }

    public string LeagueGroup { get; set; }

    public string LeagueId { get; set; }

    public string Currency { get; set; }

    public string Device { get; set; }

    public List<string> RemovalColumns { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string SortDirection { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string SortColumnName { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public int ReportBy { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string Title { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string HeaderText { get; set; }

    public bool IsExactly { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }

    public bool UsernameDrillDown { get; set; }
}