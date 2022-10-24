using AutoMapper;
using Common = RiskControl.VoidRejectRefund.Common;
using Product = RiskControl.VoidRejectRefund.Product;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Product;

namespace RiskControl.Sites.AutoMapperProfiles.VoidRejectRefund
{
    public class VoidRejectRefundProfile : Profile
    {
        public VoidRejectRefundProfile()
        {
            CreateMap<HttpParameterJsonBase, Criteria>();

            CreateMap<StatisticEntity, StatisticModel>();

            CreateMap<StatisticModel, StatisticExcelModel>();
            CreateMap<StatisticReportModel, StatisticExcelReportModel>();

            CreateMap<StatisticModel, CurrencyStatisticExcelModel>();
            CreateMap<ChildGroupStatisticModel, ChildGroupStatisticExcelModel>();
            CreateMap<GroupStatisticModel, GroupStatisticExcelModel>();
            CreateMap<GroupStatisticReportModel, GroupStatisticExcelReportModel>();
            CreateMap<ProductLeagueSportBettypeEntity, ProductLeagueSportBettypeStatistic>();

            CreateMap<Common.HttpParameterExcel, Common.HttpParameterJson>();
            CreateMap<HttpParameterGroupExcel, HttpParameterGroupJson>();
            CreateMap<Product.HttpParameterExcel, HttpParameterGroupJson>();
        }
    }
}
