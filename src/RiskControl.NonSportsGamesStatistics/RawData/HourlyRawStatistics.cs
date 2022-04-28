namespace RiskControl.NonSportsGamesStatistics.RawData
{
    public class HourlyRawStatistics
    {
        public string ReportBy { get; set; }

        public int? NoOfPlayers { get; set; }

        public int? BetCount { get; set; }

        public string Currency { get; set; }

        public decimal? TotalBets { get; set; }

        public decimal? TotalWins { get; set; }

        public decimal? TotalRefund { get; set; }

        public decimal? HouseTurnover { get; set; }

        public decimal? RealTurnover { get; set; }

        public decimal? HouseGrossIncome { get; set; }

        public decimal? HouseComm { get; set; }

        public decimal? ExtraPT { get; set; }
    }
}