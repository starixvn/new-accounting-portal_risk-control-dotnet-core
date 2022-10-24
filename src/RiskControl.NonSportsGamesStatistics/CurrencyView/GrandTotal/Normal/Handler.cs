using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal.Normal
{
    public class Handler : IRequestHandler<QueryModel, GridOptions>
    {
        private readonly Service service;
        private readonly GridOptionBuilderService gridOptionService;
        private readonly IMapper mapper;

        public Handler(
            Service service,
            GridOptionBuilderService gridOptionService,
            IMapper mapper)
        {
            this.service = service;
            this.gridOptionService = gridOptionService;
            this.mapper = mapper;
        }

        public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            var criteria = mapper.Map<Criteria>(request);

            var reportModel = await service.Query(criteria, criteria.WinLostDate).ConfigureAwait(false);

            var gridOptions = gridOptionService.BuildGridOptions(reportModel, request, request.DrillDownCurrency);

            return gridOptions;
        }
    }
}