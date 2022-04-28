using System;
using Fanex.Data;
using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.HousePositionTaking
{
    public class Criteria : CriteriaBase
    {
        [SpParam(Ignored = true)]
        public bool IsNormalMode { get; set; }

        public DateTime WinLostDate { get; set; }

        public string ProductId { get; set; }

        public int CustId { get; set; }

        public string Site { get; set; }

        public string Bettype { get; set; }

        public string LeagueId { get; set; }

        public string Sporttype { get; set; }

        public string GameTableId { get; set; }

        public int Currency { get; set; }

        public string Device { get; set; }

        public bool ExcludeTest { get; set; }

        public int TotalBetType { get; set; }

        public decimal TotalBetValue { get; set; }

        public int GameIncomeType { get; set; }

        public decimal GameIncomeValue { get; set; }

        public int HousePTType { get; set; }

        public decimal HousePTValue { get; set; }

        public string SportBetType { get; set; }

        [SpParam(Ignored = true)]
        public string Source { get; set; }

        public override bool IsValid() => true;

        public override string GetSettingKey() => $"Acc_Rpt_NonSportsProductStatistics_HousePositionTaking_{Source}";
    }
}