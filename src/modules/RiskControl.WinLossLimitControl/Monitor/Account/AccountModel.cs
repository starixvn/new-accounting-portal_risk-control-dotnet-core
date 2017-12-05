using System.Collections.Generic;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;

namespace RiskControl.WinLossLimitControl.Monitor.Account
{
    public class AccountModel
    {
        public AccountModel()
        {
            Customer = new Customer();
            UsersByDevice = new List<AssociatedUser>();
            UsersByIP = new List<AssociatedUser>();
        }

        public Customer Customer { get; set; }

        public List<AssociatedUser> UsersByDevice { get; set; }

        public List<AssociatedUser> UsersByIP { get; set; }
    }
}