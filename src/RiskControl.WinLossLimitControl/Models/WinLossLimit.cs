namespace RiskControl.WinLossLimitControl.Models;

public interface WinLossLimit
{
    decimal BlackLimit { get; set; }

    decimal GreyLimit { get; set; }

    decimal OrangeLimit { get; set; }

    decimal YellowLimit { get; set; }

    decimal RedLimit { get; set; }
}