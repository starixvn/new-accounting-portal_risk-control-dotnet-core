using Microsoft.Extensions.DependencyInjection;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Product;

namespace RiskControl.Sites.DependencyInjections;

public static class VoidRejectRefundInjection
{
    public static void RegisterVoidRejectRefundService(this IServiceCollection services)
    {
        services.AddTransient<Service, ServiceImp>();
        services.AddTransient<GroupService, GroupServiceImp>();
        services.AddTransient<ExcelBuilder, ExcelBuilderImp>();
        services.AddTransient<GroupExcelBuilder, GroupExcelBuilderImp>();
        services.AddTransient<SortingService<StatisticReportModel>, SortingServiceImp>();
        services.AddTransient<SortingService<GroupStatisticReportModel>, SortingGroupServiceImp>();
        services.AddTransient<ReportModeService, ReportModeServiceImp>();
        services.AddTransient<ProductService, ProductServiceImp>();
        services.AddTransient<SortingService<ProductModel>, ProductSortingServiceImp>();
        services.AddTransient<ProductExcelBuilder, ProductExcelBuilderImp>();
    }
}