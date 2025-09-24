using Epplus.Mapper.Annotations;

namespace RiskControl.SabaPinGoal.Model;

public class HourlyStatistics
{
    [Cell("A5")]
    public string ReportBy { get; set; }

    [Cell("B5")]
    public int? NoOfPlayers { get; set; }

    [Cell("C5")]
    public int? BetCount { get; set; }

    [Cell("D5")]
    public string Currency { get; set; }

    [Cell("E5")]
    public decimal? TotalBets { get; set; }

    [Cell("F5")]
    public decimal? TotalWins { get; set; }

    [Cell("G5")]
    public decimal? GameIncome => TotalBets - TotalWins;

    [Cell("H5")]
    public decimal? GamePayout => !TotalBets.HasValue || !TotalWins.HasValue || TotalBets == 0 ? null : TotalWins / TotalBets;

    [Cell("I5")]
    public decimal? HouseTurnover { get; set; }

    [Cell("J5")]
    public decimal? HouseGrossIncome { get; set; }

    [Cell("K5")]
    public decimal? HouseComm { get; set; }

    [Cell("L5")]
    public decimal? ExtraPT { get; set; }

    [Cell("M5")]
    public decimal? HouseNetIncome => HouseGrossIncome + HouseComm - ExtraPT;
}