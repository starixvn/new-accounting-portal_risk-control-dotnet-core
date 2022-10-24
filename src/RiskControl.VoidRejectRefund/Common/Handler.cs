using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace RiskControl.VoidRejectRefund.Common
{
    public class Handler : IRequestHandler<HttpParameterJson, StatisticReportModel>
    {
        private readonly Service service;

        private readonly SortingService<StatisticReportModel> sortingService;

        public Handler(Service service, SortingService<StatisticReportModel> sortingService)
        {
            this.service = service;
            this.sortingService = sortingService;
        }

        public async Task<StatisticReportModel> Handle(HttpParameterJson request, CancellationToken cancellationToken)
        {
            var sortColumnName = request.SortColumnName;
            var sortDirection = request.SortDirection;

            var reportModel = await service.Query(request).ConfigureAwait(false);

            if (!string.IsNullOrEmpty(sortColumnName) && !string.IsNullOrEmpty(sortDirection))
            {
                reportModel = sortingService.SortData(reportModel, sortDirection, sortColumnName);
            }

            return reportModel;
        }
    }
}
