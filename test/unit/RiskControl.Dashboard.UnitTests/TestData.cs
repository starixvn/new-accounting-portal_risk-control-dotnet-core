using RiskControl.Dashboard.Model;
using System.Collections.Generic;

namespace RiskControl.Dashboard.UnitTests
{
    public static class TestData
    {
        public static IEnumerable<TopGameTypeWinning> TopGameTypeWinningList =>
            new List<TopGameTypeWinning>
                {
                    new TopGameTypeWinning
                    {
                        Product = "Saba Casino",
                        Bettype = "Over/Under",
                        GameIncome = 592.669m
                    },
                    new TopGameTypeWinning
                    {
                        Product = "Number Game",
                        Bettype = "Handicap",
                        GameIncome = 123.0837m
                    }
                };

        public static IEnumerable<TopMemberWinning> TopMemberWinningList =>
            new List<TopMemberWinning>
                {
                    new TopMemberWinning
                    {
                        Username = "12BETUUS01001",
                        Currency = "(UUS)",
                        GameIncome = 592.669m
                    },
                    new TopMemberWinning
                    {
                        Username = "FYJ8500001",
                        Currency = "CNY (RMB)",
                        GameIncome = 123.0837m
                    }
                };
    }
}
