using Epplus.Mapper.Annotations;

namespace RiskControl.NonSportsGamesStatistics.Common;

public class BaseStatisticModel
{
    private const int OneHundredPercent = 100;

    [Cell("C5")]
    public int BetCount { get; set; }

    [Cell("E5")]
    public decimal TotalBets { get; set; }

    [Cell("F5")]
    public decimal TotalWins { get; set; }

    [Cell("G5")]
    public decimal GameIncome => TotalBets - TotalWins;

    [Cell("H5")]
    public decimal GamePayout => TotalBets == 0 ? 0 : TotalWins / TotalBets * OneHundredPercent;

    [Cell("I5")]
    public decimal TotalRefund { get; set; }

    [Cell("J5")]
    public decimal HouseTurnover { get; set; }

    [Cell("K5")]
    public decimal RealTurnover { get; set; }

    [Cell("L5")]
    public decimal HouseGrossIncome { get; set; }

    [Cell("M5")]
    public decimal HouseComm { get; set; }

    [Cell("N5")]
    public decimal ExtraPT { get; set; }

    [Cell("O5")]
    public decimal HouseNetIncome => HouseGrossIncome + HouseComm - ExtraPT;
}