using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Monitor.Unblock.Criteria;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock
{
    public interface UnblockMemberService
    {
        Task UnblockPlaceBet(ServiceParameter parameter);

        Task UnblockTransfer(ServiceParameter parameter);
    }

    public class UnblockMemberServiceImp : UnblockMemberService
    {
        private const int UnblockPlaceBetActionId = 2;

        private const int UnblockTransferActionId = 4;

        private readonly IDynamicRepository repository;

        public UnblockMemberServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task UnblockPlaceBet(ServiceParameter parameter)
        {
            await ResetPlaceBetBlockStatus(parameter).ConfigureAwait(false);
            await InsertCustomerGameMonitoringHistory(UnblockPlaceBetActionId, parameter).ConfigureAwait(false);
        }

        public async Task UnblockTransfer(ServiceParameter parameter)
        {
            await ResetTransferBlockStatus(parameter).ConfigureAwait(false);
            await InsertCustomerGameMonitoringHistory(UnblockTransferActionId, parameter).ConfigureAwait(false);
        }

        private async Task ResetPlaceBetBlockStatus(ServiceParameter parameter)
        {
            var criteria = Mapper.Map<WinLimitCustGameStatusPlaceBetUnblockCriteria>(parameter);
            await repository.ExecuteAsync(criteria).ConfigureAwait(false);
        }

        private async Task ResetTransferBlockStatus(ServiceParameter parameter)
        {
            var criteria = Mapper.Map<WinLimitCustGameStatusTransferUnblockCriteria>(parameter);

            await repository.ExecuteAsync(criteria).ConfigureAwait(false);
        }

        private async Task InsertCustomerGameMonitoringHistory(int actionId, ServiceParameter parameter)
        {
            var criteria = Mapper.Map<WinLimitCustGameMonitoringHistoryInsertCriteria>(parameter);
            criteria.ActionId = actionId;

            await repository.ExecuteAsync(criteria).ConfigureAwait(false);
        }
    }
}