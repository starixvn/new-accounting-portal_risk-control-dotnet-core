using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Monitor.Unblock.Criteria;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock;

public interface UnblockMemberService
{
    Task UnblockPlaceBet(ServiceParameter parameter);

    Task UnblockTransfer(ServiceParameter parameter);
}

public class UnblockMemberServiceImp(IDynamicRepository repository, IMapper mapper) : UnblockMemberService
{
    private const int UnblockPlaceBetActionId = 2;

    private const int UnblockTransferActionId = 4;

    public async Task UnblockPlaceBet(ServiceParameter parameter)
    {
        await ResetPlaceBetBlockStatus(parameter);
        await InsertCustomerGameMonitoringHistory(UnblockPlaceBetActionId, parameter);
    }

    public async Task UnblockTransfer(ServiceParameter parameter)
    {
        await ResetTransferBlockStatus(parameter);
        await InsertCustomerGameMonitoringHistory(UnblockTransferActionId, parameter);
    }

    private async Task ResetPlaceBetBlockStatus(ServiceParameter parameter)
    {
        var criteria = mapper.Map<WinLimitCustGameStatusPlaceBetUnblockCriteria>(parameter);
        await repository.ExecuteAsync(criteria);
    }

    private async Task ResetTransferBlockStatus(ServiceParameter parameter)
    {
        var criteria = mapper.Map<WinLimitCustGameStatusTransferUnblockCriteria>(parameter);

        await repository.ExecuteAsync(criteria);
    }

    private async Task InsertCustomerGameMonitoringHistory(int actionId, ServiceParameter parameter)
    {
        var criteria = mapper.Map<WinLimitCustGameMonitoringHistoryInsertCriteria>(parameter);
        criteria.ActionId = actionId;

        await repository.ExecuteAsync(criteria);
    }
}