using System.Threading;
using System.Threading.Tasks;
using MediatR;
using RiskControl.VoidRejectRefund.Common;

namespace RiskControl.VoidRejectRefund.Product
{
    public class ProductHandler : IRequestHandler<HttpParameterJson, ProductModel>
    {
        private readonly ProductService service;

        private readonly SortingService<ProductModel> sortingService;

        public ProductHandler(ProductService service, SortingService<ProductModel> sortingService)
        {
            this.service = service;
            this.sortingService = sortingService;
        }

        public async Task<ProductModel> Handle(HttpParameterJson request, CancellationToken cancellationToken)
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