using AutoMapper;
using Fanex.Data.Repository;
using RiskControl.BettingMonitoring.Criteria;
using RiskControl.BettingMonitoring.Models;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Update;

public interface UpdateService
{
    Task<bool> Execute(BettingMonitoringModel model);
}

public class UpdateServiceImp(IDynamicRepository dynamicRepository, IMapper mapper) : UpdateService
{
    public async Task<bool> Execute(BettingMonitoringModel model)
    {
        var criteria = mapper.Map<BettingMonitoringUpdateCriteria>(model);

        await dynamicRepository.ExecuteAsync(criteria).ConfigureAwait(false);

        return true;
    }
}