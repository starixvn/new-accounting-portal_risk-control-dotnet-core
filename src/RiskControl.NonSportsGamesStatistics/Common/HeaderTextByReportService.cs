using System.Collections.Generic;
using System.Linq;

namespace RiskControl.NonSportsGamesStatistics.Common
{
    public interface HeaderTextByReportService
    {
        string GetHeaderText(string reportBy);
    }

    public class HeaderTextByReportServiceImp : HeaderTextByReportService
    {
        const string userName = "Username";
        const string product = "Product";
        const string gameType = "Game Type";
        const string gameTable = "Game Table";
        const string bettype = "Bet Type";
        const string sportType = "Sport Type";
        const string gameGroup = "Game Group";
        const string league = "League";
        const string month = "Month";

        private readonly Dictionary<string, string> headerText = new Dictionary<string, string>
        {
            { "Daily", "Date" },
            { "Monthly", month },
            { product, product },
            { "Company", "Company" },
            { "Super", "Super" },
            { "Master", "Master" },
            { "Agent", "Agent" },
            { userName, userName },
            { "Currency", "Currency" },
            { "Device", "Device" },
            { "Top20", userName },
            { "Game Table Live Monitoring", gameTable },
            { "Hourly", "Time" },
            { "ProductSubProduct", product },
            { "ProductLeague", league },
            { "ProductBetType", bettype },
            { "ProductSportType", sportType },
            { "ProductGameType", gameType },
            { "ProductGameTable", gameTable },
            { "ProductCasinoGameGroup", gameGroup },
            { "ProductCasinoGameType", gameType },
            { "SpecificMember", userName },
            { "SpecificMemberDaily", "Date" },
            { "SpecificMemberProduct", product },
            { "SpecificMemberProductSubProduct", product },
            { "SpecificMemberProductLeague", league },
            { "SpecificMemberProductBetType", bettype },
            { "SpecificMemberProductSportType", sportType },
            { "SpecificMemberProductGameType", gameType },
            { "SpecificMemberProductGameTable", gameTable },
            { "SpecificMemberProductCasinoGameGroup", gameGroup },
            { "SpecificMemberProductCasinoGameType", gameType },
            { "SpecificMemberMonthly", month }
        };

        public string GetHeaderText(string reportBy)
        {
            return headerText.ContainsKey(reportBy) ? headerText.FirstOrDefault(x => x.Key == reportBy).Value : string.Empty;
        }
    }
}