using Fanex.Data.Repository;
using System;

namespace RiskControl.Dashboard.Criteria
{
    public class MonthlyTurnoverAndNetIncomeCriteria : CriteriaBase
    {
        public DateTime FromDate => new DateTime(
            DateTime.Now.AddMonths(-6).Year,
            DateTime.Now.AddMonths(-6).Month,
            1,
            0,
            0,
            0);

        public DateTime ToDate => new DateTime(
            DateTime.Now.AddMonths(-1).Year,
            DateTime.Now.AddMonths(-1).Month,
            DateTime.DaysInMonth(DateTime.Now.AddMonths(-1).Year, DateTime.Now.AddMonths(-1).Month),
            23,
            59,
            59);

        public override bool IsValid() => true;

        public override string GetSettingKey() => $"RiskControl_Dashboard_Monthly";
    }
}
