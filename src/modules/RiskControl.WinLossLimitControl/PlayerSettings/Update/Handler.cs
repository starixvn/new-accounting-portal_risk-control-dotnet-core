using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Update
{
    public class Handler : IRequestHandler<Request, ExecuteResult>
    {
        private readonly ValidationService validationService;

        private readonly IDynamicRepository repository;

        private readonly StateService stateService;

        public Handler(StateService stateService, ValidationService validationService, IDynamicRepository repository)
        {
            this.stateService = stateService;
            this.validationService = validationService;
            this.repository = repository;
        }

        public async Task<ExecuteResult> Handle(Request request, CancellationToken cancellationToken)
        {
            var criteria = Mapper.Map<UpdateCriteria>(request);
            criteria.UserId = stateService.UserId;
            criteria.IP = stateService.IP;
            criteria.MaxWinLimit = request.Limit;

            var valid = await validationService.Execute(request).ConfigureAwait(false);
            if (!valid)
            {
                return new ExecuteResult(1);
            }

            await repository.ExecuteAsync(criteria).ConfigureAwait(false);

            return new ExecuteResult();
        }
    }
}