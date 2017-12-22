using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting
{
    public class HandlerValidation : IRequestHandler<RequestValidation, ExecuteResult>
    {
        private readonly IDynamicRepository repository;

        public HandlerValidation(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<ExecuteResult> Handle(RequestValidation request, CancellationToken cancellationToken)
        {
            var criteria = Mapper.Map<ValidationCriteria>(request);
            return await repository.GetAsync<ExecuteResult>(criteria).ConfigureAwait(false);
        }
    }
}