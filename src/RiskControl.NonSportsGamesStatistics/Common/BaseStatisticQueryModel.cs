using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace RiskControl.NonSportsGamesStatistics.Common
{
    public class BaseStatisticQueryModel
    {
        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string ProductId { get; set; }

        public string UserName { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Site { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Bettype { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string LeagueId { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Sporttype { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string GameTableId { get; set; }

        public string Currency { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Device { get; set; }

        public bool ExcludeTest { get; set; }

        public int TotalBetType { get; set; }

        public decimal TotalBetValue { get; set; }

        public int GameIncomeType { get; set; }

        public decimal GameIncomeValue { get; set; }

        public int HousePTType { get; set; }

        public decimal HousePTValue { get; set; }

        public List<string> RemovalColumns { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string SortDirection { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string SortColumnName { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string ReportBy { get; set; }

        public bool IsNormalMode { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Title { get; set; }

        public bool ViewByInteger { get; set; }

        public string SportBetType { get; set; }

        public bool IsExactly { get; set; }
    }
}