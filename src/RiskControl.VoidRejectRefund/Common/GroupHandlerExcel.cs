using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using OfficeOpenXml;

namespace RiskControl.VoidRejectRefund.Common;

public class GroupHandlerExcel : IRequestHandler<HttpParameterGroupExcel, ExcelPackage>
{
    private readonly GroupService service;

    private readonly SortingService<GroupStatisticReportModel> sortingService;

    private readonly GroupExcelBuilder excelBuilder;

    private readonly IMapper mapper;

    public GroupHandlerExcel(GroupService service,
        SortingService<GroupStatisticReportModel> sortingService,
        GroupExcelBuilder excelBuilder,
        IMapper mapper)
    {
        this.service = service;
        this.sortingService = sortingService;
        this.excelBuilder = excelBuilder;
        this.mapper = mapper;
    }

    public async Task<ExcelPackage> Handle(HttpParameterGroupExcel request, CancellationToken cancellationToken)
    {
        var sortColumnName = request.SortColumnName;
        var sortDirection = request.SortDirection;

        var jsonMessage = mapper.Map<HttpParameterGroupJson>(request);
        var statisticModel = await service.Query(jsonMessage).ConfigureAwait(false);

        if (!string.IsNullOrEmpty(sortColumnName) && !string.IsNullOrEmpty(sortDirection))
        {
            statisticModel = sortingService.SortData(statisticModel, sortDirection, sortColumnName);
        }

        var excelModel = mapper.Map<GroupStatisticExcelReportModel>(statisticModel);

        var excelPackage = excelBuilder.Build(request, excelModel);
        return excelPackage;
    }
}