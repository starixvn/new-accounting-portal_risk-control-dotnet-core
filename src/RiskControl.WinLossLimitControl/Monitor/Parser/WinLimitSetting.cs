namespace RiskControl.WinLossLimitControl.Monitor.Parser
{
    public class WinLimitSetting
    {
        public decimal BlackLimit { get; set; }

        public decimal GreyLimit { get; set; }

        public decimal OrangeLimit { get; set; }

        public decimal YellowLimit { get; set; }

        public decimal RedLimit { get; set; }
    }
}