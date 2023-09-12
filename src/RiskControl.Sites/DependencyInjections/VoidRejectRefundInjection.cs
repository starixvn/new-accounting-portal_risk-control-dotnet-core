using MediatR;
using Microsoft.Extensions.DependencyInjection;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Product;

namespace RiskControl.Sites.DependencyInjections;

public static class VoidRejectRefundInjection
{
    public static void RegisterVoidRejectRefundService(this IServiceCollection service)
    {
        service.AddMediatR(typeof(Handler).Assembly);
        service.AddMediatR(typeof(GroupHandler).Assembly);
        service.AddMediatR(typeof(HandlerExcel).Assembly);
        service.AddMediatR(typeof(GroupHandlerExcel).Assembly);
        service.AddTransient<Service, ServiceImp>();
        service.AddTransient<GroupService, GroupServiceImp>();
        service.AddTransient<ExcelBuilder, ExcelBuilderImp>();
        service.AddTransient<GroupExcelBuilder, GroupExcelBuilderImp>();
        service.AddTransient<SortingService<StatisticReportModel>, SortingServiceImp>();
        service.AddTransient<SortingService<GroupStatisticReportModel>, SortingGroupServiceImp>();
        service.AddTransient<ReportModeService, ReportModeServiceImp>();
        service.AddTransient<ProductService, ProductServiceImp>();
        service.AddTransient<SortingService<ProductModel>, ProductSortingServiceImp>();
        service.AddTransient<ProductExcelBuilder, ProductExcelBuilderImp>();
    }
}