using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiskControl.NonSportsGamesStatistics.Headline;

public class BaseRequestModel
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public string ProductId { get; set; }

    public bool ExcludeTest { get; set; }

    public string Site { get; set; }

    public string Bettype { get; set; }

    public string LeagueId { get; set; }

    public string Sporttype { get; set; }

    public string Currency { get; set; }

    public string Device { get; set; }

    public int TotalBetType { get; set; }

    public decimal TotalBetValue { get; set; }

    public int GameIncomeType { get; set; }

    public decimal GameIncomeValue { get; set; }

    public string SportBetType { get; set; }

    public byte RoleId { get; set; }

    public bool IsDrillDown { get; set; }

    public bool IsGrandTotal { get; set; }

    public bool IsExactly { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string SortDirection { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string SortColumnName { get; set; }

    public bool ViewByInteger { get; set; }

    public string Title { get; set; }

    public bool IsToDay { get; set; }

    public List<string> RemovalColumns { get; set; }
}