using System.Threading;
using System.Threading.Tasks;
using MediatR;

namespace RiskControl.VoidRejectRefund.Common;

public class GroupHandler : IRequestHandler<HttpParameterGroupJson, GroupStatisticReportModel>
{
    private readonly GroupService service;

    private readonly SortingService<GroupStatisticReportModel> sortingService;

    public GroupHandler(GroupService service, SortingService<GroupStatisticReportModel> sortingService)
    {
        this.service = service;
        this.sortingService = sortingService;
    }

    public async Task<GroupStatisticReportModel> Handle(HttpParameterGroupJson request, CancellationToken cancellationToken)
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