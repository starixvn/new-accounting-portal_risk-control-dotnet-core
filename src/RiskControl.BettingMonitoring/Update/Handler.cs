using AutoMapper;
using Fanex.NAP.Client.Helpers.Web;
using MediatR;
using RiskControl.BettingMonitoring.Models;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.BettingMonitoring.Update
{
    public class Handler : IRequestHandler<Message, bool>
    {
        private readonly INapSession napSession;

        private readonly UpdateService updateService;

        private readonly IMapper mapper;

        public Handler(INapSession napSession, UpdateService updateService, IMapper mapper)
        {
            this.napSession = napSession;
            this.updateService = updateService;
            this.mapper = mapper;
        }

        public async Task<bool> Handle(Message request, CancellationToken cancellationToken)
        {
            var model = mapper.Map<BettingMonitoringModel>(request);
            model.UserId = napSession.UserId;
            return await updateService.Execute(model).ConfigureAwait(false);
        }
    }
}
