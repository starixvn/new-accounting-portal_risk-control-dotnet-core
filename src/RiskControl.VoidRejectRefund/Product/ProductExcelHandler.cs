using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using OfficeOpenXml;
using RiskControl.VoidRejectRefund.Common;

namespace RiskControl.VoidRejectRefund.Product
{
    public class ProductExcelHandler : IRequestHandler<HttpParameterExcel, ExcelPackage>
    {
        private readonly ProductService service;

        private readonly SortingService<ProductModel> sortingService;

        private readonly ProductExcelBuilder excelBuilder;

        private readonly IMapper mapper;

        public ProductExcelHandler(ProductService service,
            SortingService<ProductModel> sortingService,
            ProductExcelBuilder excelBuilder,
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

            var jsonMessage = mapper.Map<HttpParameterGroupJson>(request);
            var reportModel = await service.Query(jsonMessage).ConfigureAwait(false);

            if (!string.IsNullOrEmpty(sortColumnName) && !string.IsNullOrEmpty(sortDirection))
            {
                reportModel = sortingService.SortData(reportModel, sortDirection, sortColumnName);
            }

            var excelPackage = excelBuilder.Build(request, reportModel);
            return excelPackage;
        }
    }
}
