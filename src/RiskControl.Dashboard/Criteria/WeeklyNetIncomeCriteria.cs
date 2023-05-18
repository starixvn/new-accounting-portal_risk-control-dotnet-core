using Fanex.Data.Repository;
using RiskControl.Dashboard.Utility;
using System;

namespace RiskControl.Dashboard.Criteria
{
    public class WeeklyNetIncomeCriteria : CriteriaBase
    {
        public WeeklyNetIncomeCriteria()
        {
            var date = ModelsHelper.GetLastSixWeekFromLastWeek();
            FromDate = date.Item1;
            ToDate = date.Item2;
        }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public override bool IsValid() => true;

        public override string GetSettingKey() => "Acc_Rpt_NonSports_Dashboard_Weekly";
    }
}
