using RiskControl.AssociatedAcccount;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.Monitor.Account;

public class AccountModel
{
    public Customer Customer { get; set; } = new();

    public IEnumerable<TopAssociatedAccount> UsersByDevice { get; set; } = new List<TopAssociatedAccount>();

    public IEnumerable<TopAssociatedAccount> UsersByIP { get; set; } = new List<TopAssociatedAccount>();

    public IEnumerable<TopAssociatedAccount> UsersByManual { get; set; } = new List<TopAssociatedAccount>();
}