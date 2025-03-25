namespace RiskControl.WinLossLimitControl.Monitor.Account.Model;

public class Customer
{
    public int CustId { get; set; }

    public string Username { get; set; }

    public int RoleId { get; set; }

    public string SiteName { get; set; }

    public bool IsCreditUser { get; set; }
}