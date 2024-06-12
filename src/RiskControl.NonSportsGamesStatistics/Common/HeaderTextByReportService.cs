using System.Collections.Generic;
using System.Linq;

namespace RiskControl.NonSportsGamesStatistics.Common;

public interface HeaderTextByReportService
{
    string GetHeaderText(string reportBy);
}

public class HeaderTextByReportServiceImp : HeaderTextByReportService
{
    private const string userName = "Username";
    private const string product = "Product";
    private const string gameType = "Game Type";
    private const string gameTable = "Game Table";
    private const string bettype = "Bet Type";
    private const string sportType = "Sport Type";
    private const string gameGroup = "Game Group";
    private const string league = "League";
    private const string month = "Month";

    private readonly Dictionary<string, string> headerText = new()
    {
        { "Daily", "Date" },
        { "Monthly", month },
        { product, product },
        { "ProductDetail", product },
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
        { "ProductDetailSubProduct", product },
        { "ProductDetailLeague", league },
        { "ProductDetailBetType", bettype },
        { "ProductDetailSportType", sportType },
        { "ProductDetailGameType", gameType },
        { "ProductDetailGameTable", gameTable },
        { "ProductDetailCasinoGameGroup", gameGroup },
        { "ProductDetailCasinoGameType", gameType },
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
        { "SpecificMemberProductDetail", product },
        { "SpecificMemberProductDetailSubProduct", product },
        { "SpecificMemberProductDetailLeague", league },
        { "SpecificMemberProductDetailBetType", bettype },
        { "SpecificMemberProductDetailSportType", sportType },
        { "SpecificMemberProductDetailGameType", gameType },
        { "SpecificMemberProductDetailGameTable", gameTable },
        { "SpecificMemberProductDetailCasinoGameGroup", gameGroup },
        { "SpecificMemberProductDetailCasinoGameType", gameType },
        { "SpecificMemberMonthly", month }
    };

    public string GetHeaderText(string reportBy)
    {
        return headerText.ContainsKey(reportBy) ? headerText.FirstOrDefault(x => x.Key == reportBy).Value : string.Empty;
    }
}