using AutoMapper;
using MediatR;
using RiskControl.BettingMonitoring.Models;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Update;

using Fanex.NAP.Client;

public class Handler(INapSession napSession, UpdateService updateService, IMapper mapper)
    : IRequestHandler<Message, bool>
{
    public Task<bool> Handle(Message request, CancellationToken cancellationToken)
    {
        var model = mapper.Map<BettingMonitoringModel>(request);
        model.UserId = napSession.UserId;
        return updateService.Execute(model);
    }
}