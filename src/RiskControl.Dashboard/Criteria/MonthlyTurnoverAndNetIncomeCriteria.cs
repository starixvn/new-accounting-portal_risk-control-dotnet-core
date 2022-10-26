using Fanex.Data.Repository;
using System;

namespace RiskControl.Dashboard.Criteria
{
    public class MonthlyTurnoverAndNetIncomeCriteria : CriteriaBase
    {
        private const int NEGATIVE_SIX = -6;

        public MonthlyTurnoverAndNetIncomeCriteria()
        {
            FromDate = new DateTime(
                DateTime.Now.AddMonths(NEGATIVE_SIX).Year,
                DateTime.Now.AddMonths(NEGATIVE_SIX).Month,
                1,
                0,
                0,
                0);
            ToDate = new DateTime(
                DateTime.Now.AddMonths(-1).Year,
                DateTime.Now.AddMonths(-1).Month,
                DateTime.DaysInMonth(DateTime.Now.AddMonths(-1).Year, DateTime.Now.AddMonths(-1).Month),
                23,
                59,
                59);
        }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override bool IsValid() => true;

        public override string GetSettingKey() => $"RiskControl_Dashboard_Monthly";
    }
}
