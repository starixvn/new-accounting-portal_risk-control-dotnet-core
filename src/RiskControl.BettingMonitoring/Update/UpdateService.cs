using AutoMapper;
using Fanex.Data.Repository;
using RiskControl.BettingMonitoring.Criteria;
using RiskControl.BettingMonitoring.Models;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Update
{
    public interface UpdateService
    {
        Task<bool> Execute(BettingMonitoringModel model);
    }

    public class UpdateServiceImp : UpdateService
    {
        private readonly IDynamicRepository dynamicRepository;
        private readonly IMapper mapper;

        public UpdateServiceImp(IDynamicRepository dynamicRepository, IMapper mapper)
        {
            this.dynamicRepository = dynamicRepository;
            this.mapper = mapper;
        }

        public async Task<bool> Execute(BettingMonitoringModel model)
        {
            var criteria = mapper.Map<BettingMonitoringUpdateCriteria>(model);

            await dynamicRepository.ExecuteAsync(criteria).ConfigureAwait(false);

            return true;
        }
    }
}
