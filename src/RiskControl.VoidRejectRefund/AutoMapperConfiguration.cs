using AutoMapper;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Product;

namespace RiskControl.VoidRejectRefund
{
    public static class AutoMapperConfiguration
    {
        public static void InitializeVoidRejectRefund(this IProfileExpression cfg)
        {

            cfg.CreateMap<HttpParameterJsonBase, Criteria>();

            cfg.CreateMap<StatisticEntity, StatisticModel>();

            cfg.CreateMap<StatisticModel, StatisticExcelModel>();
            cfg.CreateMap<StatisticReportModel, StatisticExcelReportModel>();

            cfg.CreateMap<StatisticModel, CurrencyStatisticExcelModel>();
            cfg.CreateMap<ChildGroupStatisticModel, ChildGroupStatisticExcelModel>();
            cfg.CreateMap<GroupStatisticModel, GroupStatisticExcelModel>();
            cfg.CreateMap<GroupStatisticReportModel, GroupStatisticExcelReportModel>();
            cfg.CreateMap<ProductLeagueSportBettypeEntity, ProductLeagueSportBettypeStatistic>();

            cfg.CreateMap<Common.HttpParameterExcel, Common.HttpParameterJson>();
            cfg.CreateMap<HttpParameterGroupExcel, HttpParameterGroupJson>();
            cfg.CreateMap<Product.HttpParameterExcel, HttpParameterGroupJson>();
        }
    }
}
