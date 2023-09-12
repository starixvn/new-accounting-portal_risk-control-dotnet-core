using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock;

public class HandlerUnblockTransfer : IRequestHandler<RequestUnblockTransfer, ExecuteResult>
{
    private readonly UserHttpContext userHttpContext;

    private readonly UnblockMemberService unblockMemberService;

    private readonly IMapper mapper;

    public HandlerUnblockTransfer(UserHttpContext userHttpContext, UnblockMemberService unblockMemberService, IMapper mapper)
    {
        this.unblockMemberService = unblockMemberService;
        this.userHttpContext = userHttpContext;
        this.mapper = mapper;
    }

    public async Task<ExecuteResult> Handle(RequestUnblockTransfer request, CancellationToken cancellationToken)
    {
        var parameter = mapper.Map<ServiceParameter>(request);
        parameter.UserId = userHttpContext.UserId;
        parameter.IP = userHttpContext.IP;

        await unblockMemberService.UnblockTransfer(parameter);
        return new ExecuteResult();
    }
}