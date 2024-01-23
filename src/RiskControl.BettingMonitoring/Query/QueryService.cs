using Fanex.Data.Repository;
using RiskControl.BettingMonitoring.Criteria;
using RiskControl.BettingMonitoring.Models;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Query;

public interface QueryService
{
    Task<BettingMonitoringModel> Execute();
}

public class QueryServiceImp(IDynamicRepository dynamicRepository) : QueryService
{
    public async Task<BettingMonitoringModel> Execute()
    {
        var criteria = new BettingMonitoringQueryCriteria();

        var rawData = await dynamicRepository.FetchAsync<RawSelectModel>(criteria).ConfigureAwait(false);
        var minimumTickets = rawData
            .Where(x => x.SettingName == "MinimumTickets")
            .Select(x=>x.Value)
            .FirstOrDefault();
        var threshold = rawData.Where(x => x.SettingName == "Threshold")
            .Select(x => x.Value)
            .FirstOrDefault();

        int.TryParse(minimumTickets, out var minimumTicketsIntValue);
        int.TryParse(threshold, out var thresholdIntValue);

        return new BettingMonitoringModel
        {
            MinimumTickets = minimumTicketsIntValue,
            Threshold = thresholdIntValue
        };
    }
}