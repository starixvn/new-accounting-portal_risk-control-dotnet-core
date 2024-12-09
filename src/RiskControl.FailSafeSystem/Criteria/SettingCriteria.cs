using Fanex.Data.Repository;

namespace RiskControl.FailSafeSystem.Criteria
{
    public class SettingCriteria : CriteriaBase
    {
        public string ProductIdList { get; set; }

        public string ConstantKeyList { get; set; }

        public override string GetSettingKey() => "fss_Setting";

        public override bool IsValid() => true;
    }
}
