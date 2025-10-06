namespace RiskControl.SabaPinGoal.Model;

public class BaseRawStatisticModel
{
    public string TopType { get; set; }

    public byte RoleId { get; set; }

    public bool IsDeposit { get; set; }

    public int SiteId { get; set; }

    public int ReportById { get; set; }

    public string ReportBy { get; set; }

    public int NoOfPlayers { get; set; }

    public int CurrencyId { get; set; }

    public string Currency { get; set; }

    public int BetCount { get; set; }

    public decimal TotalBets { get; set; }

    public decimal TotalWins { get; set; }

    public decimal HouseTurnover { get; set; }

    public decimal HouseGrossIncome { get; set; }

    public decimal HouseComm { get; set; }

    public decimal ExtraPT { get; set; }

    public decimal GameIncome => TotalBets - TotalWins;

    public decimal GamePayout => TotalBets == 0 ? 0 : TotalWins / TotalBets * 100;

    public decimal HouseNetIncome => HouseGrossIncome + HouseComm - ExtraPT;
}