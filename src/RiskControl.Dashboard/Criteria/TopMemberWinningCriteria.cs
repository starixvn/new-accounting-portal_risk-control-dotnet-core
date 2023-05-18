using Fanex.Data.Repository;
using System;

namespace RiskControl.Dashboard.Criteria
{
    public class TopMemberWinningCriteria : CriteriaBase
    {
        public DateTime FromDate => DateTime.Now;

        public DateTime ToDate => DateTime.Now;

        public bool IsDeposit { get; set; }

        public override bool IsValid() => true;

        public override string GetSettingKey() => $"RiskControl_Dashboard_TopMemberWinning";
    }
}
