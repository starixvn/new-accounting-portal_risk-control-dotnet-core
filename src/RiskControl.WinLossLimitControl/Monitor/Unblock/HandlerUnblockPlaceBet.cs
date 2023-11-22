using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock;

public class HandlerUnblockPlaceBet(UserHttpContext userHttpContext, UnblockMemberService unblockMemberService,
        IMapper mapper)
    : IRequestHandler<RequestUnblockPlaceBet, ExecuteResult>
{
    public async Task<ExecuteResult> Handle(RequestUnblockPlaceBet request, CancellationToken cancellationToken)
    {
        var parameter = mapper.Map<ServiceParameter>(request);
        parameter.UserId = userHttpContext.UserId;
        parameter.IP = userHttpContext.IP;

        await unblockMemberService.UnblockPlaceBet(parameter);

        return new ExecuteResult();
    }
}