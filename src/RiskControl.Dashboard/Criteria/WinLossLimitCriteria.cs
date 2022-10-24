using Fanex.Data.Repository;
using System;

namespace RiskControl.Dashboard.Criteria
{
    public class WinLossLimitCriteria : CriteriaBase
    {
        public DateTime FromDate => new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);

        public DateTime ToDate => new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 23, 59, 59);

        public override bool IsValid() => true;

        public override string GetSettingKey() => $"RiskControl_Dashboard_WinLossLimit";
    }
}
