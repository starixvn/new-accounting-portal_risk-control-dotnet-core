using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using OfficeOpenXml;

namespace RiskControl.VoidRejectRefund.Common
{
    public class HandlerExcel : IRequestHandler<HttpParameterExcel, ExcelPackage>
    {
        private readonly Service service;

        private readonly SortingService<StatisticReportModel> sortingService;

        private readonly ExcelBuilder excelBuilder;

        private readonly IMapper mapper;

        public HandlerExcel(Service service,
            SortingService<StatisticReportModel> sortingService,
            ExcelBuilder excelBuilder,
            IMapper mapper)
        {
            this.service = service;
            this.sortingService = sortingService;
            this.excelBuilder = excelBuilder;
            this.mapper = mapper;
        }

        public async Task<ExcelPackage> Handle(HttpParameterExcel request, CancellationToken cancellationToken)
        {
            var sortColumnName = request.SortColumnName;
            var sortDirection = request.SortDirection;

            var jsonMessage = mapper.Map<HttpParameterJson>(request);
            var statisticModel = await service.Query(jsonMessage).ConfigureAwait(false);

            if (!string.IsNullOrEmpty(sortColumnName) && !string.IsNullOrEmpty(sortDirection))
            {
                statisticModel = sortingService.SortData(statisticModel, sortDirection, sortColumnName);
            }

            var excelModel = mapper.Map<StatisticExcelReportModel>(statisticModel);
            var excelPackage = excelBuilder.Build(request, excelModel);
            return excelPackage;
        }
    }
}
