using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.HousePositionTaking
{
    public class QueryModel : IRequest<IEnumerable<HousePositionTakingModel>>
    {
        public bool IsNormalMode { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string ProductId { get; set; }

        public int CustId { get; set; }

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

        public string SportBetType { get; set; }
    }
}