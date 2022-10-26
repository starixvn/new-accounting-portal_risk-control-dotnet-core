using Fanex.Data.Repository;
using System;

namespace RiskControl.Dashboard.Criteria
{
    public class WinLossLimitCriteria : CriteriaBase
    {
        public WinLossLimitCriteria()
        {
            FromDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
            ToDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59);
        }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override bool IsValid() => true;

        public override string GetSettingKey() => $"RiskControl_Dashboard_WinLossLimit";
    }
}
