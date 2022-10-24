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
        private readonly IMapper mapper;

        public HandlerValidation(IDynamicRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<ExecuteResult> Handle(RequestValidation request, CancellationToken cancellationToken)
        {
            var criteria = mapper.Map<ValidationCriteria>(request);
            return await repository.GetAsync<ExecuteResult>(criteria);
        }
    }
}