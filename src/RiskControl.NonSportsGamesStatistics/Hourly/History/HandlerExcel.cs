using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using OfficeOpenXml;

namespace RiskControl.NonSportsGamesStatistics.Hourly.History
{
    public class HandlerExcel : IRequestHandler<QueryModelExcel, ExcelPackage>
    {
        private readonly Service service;

        private readonly ExcelReportBuilder excelBuilder;

        private readonly IMapper mapper;

        public HandlerExcel(Service service, ExcelReportBuilder excelBuilder, IMapper mapper)
        {
            this.service = service;
            this.excelBuilder = excelBuilder;
            this.mapper = mapper;
        }

        public async Task<ExcelPackage> Handle(QueryModelExcel request, CancellationToken cancellationToken)
        {
            var criteria = mapper.Map<Criteria>(request);
            var model = await service.CalculateHourlyReport(criteria, criteria.FromDate).ConfigureAwait(false);
            var excelPackage = excelBuilder.CreateExcelPackage(model, request.FromDate, request.ViewByInteger);
            return excelPackage;
        }
    }
}