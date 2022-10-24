using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update
{
    public class UpdateCriteria : CriteriaBase, INonQueryCommand
    {
        public string Xml { get; set; }

        public int UserId { get; set; }

        public string IP { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_CurrencySettingUpd";

        public override bool IsValid() => true;
    }
}