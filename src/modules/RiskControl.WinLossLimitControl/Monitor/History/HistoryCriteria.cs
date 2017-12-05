using Fanex.Data.Repository;

namespace RiskControl.WinLossLimitControl.Monitor.History
{
    public class HistoryCriteria : CriteriaBase
    {
        public int ProductId { get; set; }

        public int CustId { get; set; }

        public override string GetSettingKey() => "NAP_WinLimit_HistorySel";

        public override bool IsValid() => true;
    }
}