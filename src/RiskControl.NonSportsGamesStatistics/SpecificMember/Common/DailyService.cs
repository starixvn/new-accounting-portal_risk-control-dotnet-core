using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Common;

public interface DailyService
{
    Task<DailyViewReportModel> Query(BaseHistoryCriteria historyCriteria, BaseNormalCriteria normalCriteria);
}

public class DailyServiceImp : DailyService
{
    private readonly RawService rawService;
    private readonly CalculationService service;

    public DailyServiceImp(RawService rawService, CalculationService service)
    {
        this.rawService = rawService;
        this.service = service;
    }

    public async Task<DailyViewReportModel> Query(BaseHistoryCriteria historyCriteria, BaseNormalCriteria normalCriteria)
    {
        var dailyRawData = new GenericRawData<BaseRawStatistic>();
        var rawData = await rawService.QueryDataFromBettransAndWarehouse<BaseRawStatistic>(historyCriteria, normalCriteria);

        dailyRawData.RawStatistics = CalculateRawStatistics(rawData.RawStatistics);
        dailyRawData.Total = CalculateTotal(rawData.Total);
        return service.CalculateDailyViewReport(dailyRawData);
    }

    private IEnumerable<BaseRawStatistic> CalculateRawStatistics(IEnumerable<BaseRawStatistic> rawData)
    {
        var groups = rawData.Where(item => item.NoOfPlayers != 0).GroupBy(x => new { x.ReportById, x.ReportBy, x.CurrencyId });

        var result = from @group in groups
            let items = rawData.Where(
                x => x.ReportById == @group.Key.ReportById
                     && x.ReportBy == @group.Key.ReportBy
                     && x.CurrencyId == @group.Key.CurrencyId
                     && x.NoOfPlayers != 0)
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