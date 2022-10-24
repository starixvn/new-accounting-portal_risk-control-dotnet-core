using System;

namespace RiskControl.WinLossLimitControl.Monitor.Account.Model
{
    public class AssociatedUser
    {
        public string Username { get; set; }

        public string SiteName { get; set; }

        public string Evidence { get; set; }

        public DateTime LastAccessedDate { get; set; }
    }
}