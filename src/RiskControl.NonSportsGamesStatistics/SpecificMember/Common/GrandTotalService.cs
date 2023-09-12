using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Common;

public interface GrandTotalService
{
    Task<CurrencyViewStatisticsReportModel> Query(BaseHistoryCriteria historyCriteria, BaseNormalCriteria normalCriteria);

}
public class GrandTotalServiceImp : GrandTotalService
{
    private readonly RawService rawService;
    private readonly CalculationService service;

    public GrandTotalServiceImp(RawService rawService, CalculationService service)
    {
        this.rawService = rawService;
        this.service = service;
    }

    public async Task<CurrencyViewStatisticsReportModel> Query(BaseHistoryCriteria historyCriteria, BaseNormalCriteria normalCriteria)
    {
        var rawData = await rawService.QueryDataFromBettransAndWarehouse<BaseRawStatistic>(historyCriteria, normalCriteria);

        rawData.RawStatistics = CalculateRawStatistics(rawData.RawStatistics);
        rawData.Total = CalculateTotal(rawData.Total);

        return service.CalculateGrandTotalForDailyAndCurrencyView(rawData);
    }

    private IEnumerable<BaseRawStatistic> CalculateRawStatistics(IEnumerable<BaseRawStatistic> rawData)
    {
        var grandTotalRawData = rawData.Where(item => item.NoOfPlayers != 0);

        var groups = grandTotalRawData.GroupBy(x => new { x.ReportBy, x.CurrencyId });

        var result = from @group in groups
            let items = grandTotalRawData.Where(
                x => x.ReportBy == @group.Key.ReportBy
                     && x.CurrencyId == @group.Key.CurrencyId)
            select service.CalculateSum(items);

        return result;
    }

    private List<BaseRawStatistic> CalculateTotal(IEnumerable<BaseRawStatistic> rawStatistics)
    {
        return new List<BaseRawStatistic>
        {
            service.CalculateSum(rawStatistics)
        };
    }
}