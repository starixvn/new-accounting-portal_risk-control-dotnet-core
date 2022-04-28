using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using OfficeOpenXml;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main.Normal
{
    public class HandlerExcel : IRequestHandler<QueryModelExcel, ExcelPackage>
    {
        private readonly Service<UserNameViewReportModel> service;
        private readonly ExcelReportBuilder excelBuilder;
        private readonly IMapper mapper;

        public HandlerExcel(Service<UserNameViewReportModel> service, ExcelReportBuilder excelBuilder, IMapper mapper)
        {
            this.service = service;
            this.excelBuilder = excelBuilder;
            this.mapper = mapper;
        }

        public async Task<ExcelPackage> Handle(QueryModelExcel request, CancellationToken cancellationToken)
        {
            var criteria = mapper.Map<Criteria>(request);
            var reportModel = await service.Query(criteria, criteria.WinLostDate).ConfigureAwait(false);
            var excelPackage = excelBuilder.CreateExcelPackage(reportModel, request);
            return excelPackage;
        }
    }
}