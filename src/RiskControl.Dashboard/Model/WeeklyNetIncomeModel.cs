namespace RiskControl.Dashboard.Model;

public class WeeklyNetIncomeModel
{
    public string Week { get; set; }

    public decimal CreditNetIncome { get; set; }

    public decimal DepositNetIncome { get; set; }

    public decimal NetIncome => CreditNetIncome + DepositNetIncome;
}