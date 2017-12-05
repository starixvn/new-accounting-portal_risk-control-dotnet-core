using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using System.Threading.Tasks;
namespace RiskControl.WinLossLimitControl.PlayerSettings.Delete
{
    public class Handler : IAsyncRequestHandler<Request, ExecuteResult>
    {
        private readonly StateService stateService;

        private readonly IDynamicRepository repository;

        public Handler(StateService stateService, IDynamicRepository repository)
        {
            this.stateService = stateService;
            this.repository = repository;
        }

        public async Task<ExecuteResult> Handle(Request message)
        {
            var criteria = Mapper.Map<DeleteCriteria>(message);
            criteria.UserId = stateService.UserId;
            criteria.IP = stateService.IP;

            await repository.ExecuteAsync(criteria).ConfigureAwait(false);
            return new ExecuteResult();
        }
    }
}