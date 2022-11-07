using RiskControl.Dashboard.Model;
using System.Collections.Generic;

namespace RiskControl.Dashboard.UnitTests
{
    public static class TestData
    {
        public static IEnumerable<CurrencyNetIncome> CurrencyNetIncomeList =>
            new List<CurrencyNetIncome>
                {
                    new CurrencyNetIncome
                    {
                        Currency = "(UUS)",
                        NetIncome = 1.2m
                    },
                    new CurrencyNetIncome
                    {
                       Currency = "US",
                        NetIncome = 2.2m
                    }
                };

        public static IEnumerable<MonthlyTurnoverAndNetIncome> MonthlyTurnoverAndNetIncomeList =>
            new List<MonthlyTurnoverAndNetIncome>
                {
                    new MonthlyTurnoverAndNetIncome
                    {
                        Month = "05/2022",
                        NetIncome = 11.8534m,
                        Turnover = 592.669m
                    },
                    new MonthlyTurnoverAndNetIncome
                    {
                        Month = "09/2022",
                        NetIncome = -158.8774m,
                        Turnover = 123.0837m
                    }
                };

        public static IEnumerable<ProductTurnover> ProductTurnoverList =>
            new List<ProductTurnover>
                {
                    new ProductTurnover
                    {
                        Product = "Saba Casino",
                        Turnover = 592.669m
                    },
                    new ProductTurnover
                    {
                        Product = "Number Game",
                        Turnover = 123.0837m
                    }
                };

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

        public static IEnumerable<WinLossLimit> WinLossLimitList =>
            new List<WinLossLimit>
                {
                    new WinLossLimit
                    {
                        Product = "Saba Casino",
                        UserName = "12BETUUS01001",
                        Currency = "(UUS)",
                        LimitLevel = -5
                    },
                    new WinLossLimit
                    {
                        Product = "Number Game",
                        UserName = "FYJ8500001",
                        Currency = "CNY (RMB)",
                        LimitLevel = -2
                    }
                };
    }
}
