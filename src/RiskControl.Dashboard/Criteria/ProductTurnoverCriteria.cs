using Fanex.Data.Repository;
using System;

namespace RiskControl.Dashboard.Criteria
{
    class ProductTurnoverCriteria : CriteriaBase
    {
        public DateTime FromDate => new DateTime(
          DateTime.Now.Year,
          DateTime.Now.Month,
          1,
          0,
          0,
          0);

        public DateTime ToDate => new DateTime(
            DateTime.Now.AddDays(-1).Year,
            DateTime.Now.AddDays(-1).Month,
            DateTime.Now.AddDays(-1).Day,
            23,
            59,
            59);

        public override bool IsValid() => true;

        public override string GetSettingKey() => $"RiskControl_Dashboard_Product";
    }
}
