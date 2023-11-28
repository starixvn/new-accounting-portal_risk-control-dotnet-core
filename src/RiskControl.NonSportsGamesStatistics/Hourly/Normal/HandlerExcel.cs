using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using OfficeOpenXml;

namespace RiskControl.NonSportsGamesStatistics.Hourly.Normal;

public class HandlerExcel(Service service, ExcelReportBuilder excelBuilder, IMapper mapper)
    : IRequestHandler<QueryModelExcel, ExcelPackage>
{
    public async Task<ExcelPackage> Handle(QueryModelExcel request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<Criteria>(request);
        var model = await service.CalculateHourlyReport(criteria, criteria.WinLostDate).ConfigureAwait(false);
        var excelPackage = excelBuilder.CreateExcelPackage(model, request.WinLostDate, request.ViewByInteger);
        return excelPackage;
    }
}