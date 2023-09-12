using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;

namespace RiskControl.WinLossLimitControl.GameRound;

public interface BetLimitMonitorDataService
{
    Task<List<BetLimitMonitorModel>> Query(BetLimitMonitorQueryCriteria criteria);

}
public class BetLimitMonitorDataServiceImp : BetLimitMonitorDataService
{
    private readonly IDynamicRepository dynamicRepository;

    public BetLimitMonitorDataServiceImp(IDynamicRepository dynamicRepository)
    {
        this.dynamicRepository = dynamicRepository;
    }

    public async Task<List<BetLimitMonitorModel>> Query(BetLimitMonitorQueryCriteria criteria)
    {
        var models = (await dynamicRepository.FetchAsync<BetLimitMonitorModel>(criteria)).ToList();
        var index = 1;
        models.ForEach(m =>
        {
            m.Index = index++;
        });

        return models;
    }
}