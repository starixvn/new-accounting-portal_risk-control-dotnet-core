using AutoMapper;
using Fanex.Data.Repository;
using Fanex.NAP.Client.Helpers.Web;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.History;

public class HandlerUncheckedNotification : IRequestHandler<RequestUncheckedNotification, ExecuteResult>
{
    private readonly IDynamicRepository repository;
    private readonly INapSession sessionService;
    private readonly IMapper mapper;


    public HandlerUncheckedNotification(IDynamicRepository repository, INapSession sessionService, IMapper mapper)
    {
        this.repository = repository;
        this.sessionService = sessionService;
        this.mapper = mapper;
    }

    public async Task<ExecuteResult> Handle(RequestUncheckedNotification request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<UncheckedNotificationCriteria>(request);
        criteria.UserID = sessionService.UserId;
        await repository.ExecuteAsync(criteria, cancellationToken);
        return new ExecuteResult();
    }
}