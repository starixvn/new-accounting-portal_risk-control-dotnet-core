using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.History;

using Fanex.NAP.Client;

public class HandlerUncheckedNotification(IDynamicRepository repository, INapSession sessionService, IMapper mapper)
    : IRequestHandler<RequestUncheckedNotification, ExecuteResult>
{
    public async Task<ExecuteResult> Handle(RequestUncheckedNotification request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<UncheckedNotificationCriteria>(request);
        criteria.UserID = sessionService.UserId;
        await repository.ExecuteAsync(criteria);
        return new ExecuteResult();
    }
}