using Fanex.Data.Repository;
using RiskControl.BettingMonitoring.Criteria;
using RiskControl.BettingMonitoring.Models;
using System.Globalization;
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
        var minimumTickets = string.Empty;
        var threshold = string.Empty;

        if (rawData.Any())
        {
            minimumTickets = rawData.FirstOrDefault(x => x.SettingName == "MinimumTickets").Value;
            threshold = rawData.FirstOrDefault(x => x.SettingName == "Threshold").Value;
        }

        return new BettingMonitoringModel
        {
            MinimumTickets = string.IsNullOrEmpty(minimumTickets) ? 0 : int.Parse(minimumTickets, CultureInfo.CurrentCulture.NumberFormat),
            Threshold = string.IsNullOrEmpty(threshold) ? 0 : int.Parse(threshold, CultureInfo.CurrentCulture.NumberFormat)
        };
    }
}