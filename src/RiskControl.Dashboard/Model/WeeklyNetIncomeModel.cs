namespace RiskControl.Dashboard.Model
{
    public class WeeklyNetIncomeModel
    {
        public string Week { get; set; }

        public decimal CreditNetIncome { get; }

        public decimal DepositNetIncome { get; }

        public decimal NetIncome => CreditNetIncome + DepositNetIncome;
    }
}
