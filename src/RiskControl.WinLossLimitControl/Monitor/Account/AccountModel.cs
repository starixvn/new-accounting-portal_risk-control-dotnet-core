using RiskControl.AssociatedAcccount;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.Monitor.Account;

public class AccountModel
{
    public Customer Customer { get; set; } = new();

    public List<AssociationModel> Associations { get; set; } = new List<AssociationModel>();
}