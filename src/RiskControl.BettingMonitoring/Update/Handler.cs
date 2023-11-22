using AutoMapper;
using Fanex.NAP.Client.Helpers.Web;
using MediatR;
using RiskControl.BettingMonitoring.Models;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Update;

public class Handler(INapSession napSession, UpdateService updateService, IMapper mapper)
    : IRequestHandler<Message, bool>
{
    public async Task<bool> Handle(Message request, CancellationToken cancellationToken)
    {
        var model = mapper.Map<BettingMonitoringModel>(request);
        model.UserId = napSession.UserId;
        return await updateService.Execute(model).ConfigureAwait(false);
    }
}