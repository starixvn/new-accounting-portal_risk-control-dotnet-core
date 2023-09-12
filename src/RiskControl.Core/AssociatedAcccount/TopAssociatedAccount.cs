using System;

namespace RiskControl.Core.AssociatedAcccount;

public class TopAssociatedAccount
{
    public int CustId { get; set; }

    public string Site { get; set; }

    public string Username { get; set; }

    public DateTime LastBettingDate { get; set; }
}