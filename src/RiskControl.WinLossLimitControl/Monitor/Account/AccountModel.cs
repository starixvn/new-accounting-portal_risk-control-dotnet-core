using RiskControl.Core.AssociatedAcccount;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.Monitor.Account;

public class AccountModel
{
    public AccountModel()
    {
        Customer = new Customer();
        UsersByDevice = new List<TopAssociatedAccount>();
        UsersByIP = new List<TopAssociatedAccount>();
        UsersByManual = new List<TopAssociatedAccount>();
    }

    public Customer Customer { get; set; }

    public IEnumerable<TopAssociatedAccount> UsersByDevice { get; set; }

    public IEnumerable<TopAssociatedAccount> UsersByIP { get; set; }

    public IEnumerable<TopAssociatedAccount> UsersByManual { get; set; }
}