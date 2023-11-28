using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock;

public class HandlerUnblockTransfer(UserHttpContext userHttpContext, UnblockMemberService unblockMemberService,
        IMapper mapper)
    : IRequestHandler<RequestUnblockTransfer, ExecuteResult>
{
    public async Task<ExecuteResult> Handle(RequestUnblockTransfer request, CancellationToken cancellationToken)
    {
        var parameter = mapper.Map<ServiceParameter>(request);
        parameter.UserId = userHttpContext.UserId;
        parameter.IP = userHttpContext.IP;

        await unblockMemberService.UnblockTransfer(parameter);
        return new ExecuteResult();
    }
}