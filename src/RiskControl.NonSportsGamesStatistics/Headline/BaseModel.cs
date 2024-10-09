namespace RiskControl.NonSportsGamesStatistics.Headline;

public class BaseModel
{
    public int CurrencyId { get; set; }

    public string Currency { get; set; }

    public int BetCount { get; set; }

    public decimal TotalBets { get; set; }

    public decimal TotalWins { get; set; }

    public decimal TotalRefund { get; set; }

    public decimal HouseTurnOver { get; set; }

    public decimal RealTurnOver { get; set; }

    public decimal HouseGrossIncome { get; set; }

    public decimal HouseComm { get; set; }

    public decimal ExtraPT { get; set; }

    public decimal HouseNetIncome => HouseGrossIncome + HouseComm - ExtraPT;

    public decimal GameIncome => TotalBets - TotalWins;

    public decimal GamePayout => TotalBets == 0 ? 0 : TotalWins / TotalBets * 100;
}