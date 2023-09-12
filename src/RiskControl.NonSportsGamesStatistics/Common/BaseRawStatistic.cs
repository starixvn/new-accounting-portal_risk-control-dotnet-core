namespace RiskControl.NonSportsGamesStatistics.Common;

public class BaseRawStatistic
{
    public string ReportById { get; set; }

    public string ReportBy { get; set; }

    public int NoOfPlayers { get; set; }

    public int CurrencyId { get; set; }

    public string Currency { get; set; }

    public int BetCount { get; set; }

    public decimal TotalBets { get; set; }

    public decimal TotalWins { get; set; }

    public decimal TotalRefund { get; set; }

    public decimal HouseTurnover { get; set; }

    public decimal RealTurnover { get; set; }

    public decimal HouseGrossIncome { get; set; }

    public decimal HouseComm { get; set; }

    public decimal ExtraPT { get; set; }
}