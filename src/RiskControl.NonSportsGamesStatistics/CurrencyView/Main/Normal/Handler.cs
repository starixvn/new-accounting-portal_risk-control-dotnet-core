using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Excel.Models;
using MediatR;

namespace RiskControl.NonSportsGamesStatistics.CurrencyView.Main.Normal
{
    public class Handler : IRequestHandler<QueryModel, GridOptions>
    {
        private readonly Service service;
        private readonly SortingService sortingService;
        private readonly GridOptionBuilderService gridOptionService;
        private readonly IMapper mapper;

        public Handler(
            Service service,
            SortingService sortingService,
            GridOptionBuilderService gridOptionService,
            IMapper mapper)
        {
            this.service = service;
            this.sortingService = sortingService;
            this.gridOptionService = gridOptionService;
            this.mapper = mapper;
        }

        public async Task<GridOptions> Handle(QueryModel request, CancellationToken cancellationToken)
        {
            var criteria = mapper.Map<Criteria>(request);

            var reportModel = await service.Query(criteria, criteria.WinLostDate).ConfigureAwait(false);

            if (!string.IsNullOrEmpty(request.SortColumnName) && !string.IsNullOrEmpty(request.SortDirection))
            {
                reportModel = sortingService.SortData(reportModel, request.SortDirection, request.SortColumnName);
            }

            var gridOptions = gridOptionService.BuildGridOptions(reportModel, request, request.DrillDownCurrency);

            return gridOptions;
        }
    }
}