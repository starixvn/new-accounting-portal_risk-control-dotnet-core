using System;
using RiskControl.Core.BalanceUp;

namespace RiskControl.Application.BalanceUp
{
    public class ViewModel
    {
        public DateTime Today { get; set; }

        public BalanceUpRange BalanceUpRange { get; set; }
    }
}
