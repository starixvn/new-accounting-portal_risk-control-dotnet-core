using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.Filter.Model
{
    public class SiteGroup
    {
        public string GroupName { get; set; }

        public List<Site> Sites { get; set; }
    }
}