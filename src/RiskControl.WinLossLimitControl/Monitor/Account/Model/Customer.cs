namespace RiskControl.WinLossLimitControl.Monitor.Account.Model;

public class Customer
{
    public int CustId { get; set; }

    public string Username { get; set; }

    public string Agent { get; set; }

    public int AgentId { get; set; }

    public string Master { get; set; }

    public int MasterId { get; set; }

    public string Super { get; set; }

    public int SuperId { get; set; }

    public string SiteName { get; set; }

    public bool IsCreditUser { get; set; }
}