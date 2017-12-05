using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting
{
    public class HandlerValidation : IAsyncRequestHandler<RequestValidation, ExecuteResult>
    {
        private readonly IDynamicRepository repository;

        public HandlerValidation(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public async Task<ExecuteResult> Handle(RequestValidation message)
        {
            var criteria = Mapper.Map<ValidationCriteria>(message);
            return await repository.GetAsync<ExecuteResult>(criteria).ConfigureAwait(false);
        }
    }
}