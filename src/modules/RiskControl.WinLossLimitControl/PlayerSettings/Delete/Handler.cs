using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using System.Threading.Tasks;
using System.Threading;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Delete
{
    public class Handler : IRequestHandler<Request, ExecuteResult>
    {
        private readonly StateService stateService;

        private readonly IDynamicRepository repository;

        public Handler(StateService stateService, IDynamicRepository repository)
        {
            this.stateService = stateService;
            this.repository = repository;
        }

        public async Task<ExecuteResult> Handle(Request request, CancellationToken cancellationToken)
        {
            var criteria = Mapper.Map<DeleteCriteria>(request);
            criteria.UserId = stateService.UserId;
            criteria.IP = stateService.IP;

            await repository.ExecuteAsync(criteria).ConfigureAwait(false);
            return new ExecuteResult();
        }
    }
}