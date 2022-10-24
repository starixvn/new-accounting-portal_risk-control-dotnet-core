using System;

namespace RiskControl.WinLossLimitControl.Monitor.Account.Model
{
    public class CustomerIP
    {
        public string Username { get; set; }

        public int CustId { get; set; }

        public string IP { get; set; }

        public DateTime LastAccessedDate { get; set; }
    }
}