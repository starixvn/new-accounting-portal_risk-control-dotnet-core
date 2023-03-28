using System;
using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.Search
{
    public class MonitorSearchCriteria : CriteriaBase
    {
        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int ProductId { get; set; }

        public string Username { get; set; }

        public string MultiSite { get; set; }

        public int CurrencyId { get; set; }

        public string LevelId { get; set; }

        public bool ExcludeTestData { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_MonitorSel";

        public override bool IsValid() => true;
    }
}