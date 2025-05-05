using AutoMapper;
using DailyViewRoot = RiskControl.NonSportsGamesStatistics.DailyView;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class DailyViewProfile : Profile
{
    public DailyViewProfile()
    {
        CreateMap<DailyViewRoot.Daily.QueryModel, DailyViewRoot.Daily.Criteria>();
        CreateMap<DailyViewRoot.Daily.QueryModel, DailyViewRoot.Daily.Criteria>();
        CreateMap<DailyViewRoot.Daily.QueryModel, DailyViewRoot.Daily.Criteria>();
        CreateMap<DailyViewRoot.GrandTotal.DailyGrandTotal.QueryModel, DailyViewRoot.GrandTotal.DailyViewGrandTotal.Criteria>();
        CreateMap<DailyViewRoot.GrandTotal.DailyViewGrandTotal.QueryModel, DailyViewRoot.GrandTotal.DailyViewGrandTotal.Criteria>();
        CreateMap<DailyViewRoot.GrandTotal.ProductGrandTotal.QueryModel, DailyViewRoot.GrandTotal.ProductGrandTotal.Criteria>();
        CreateMap<DailyViewRoot.GroupStatistics.Company.QueryModel, DailyViewRoot.GroupStatistics.Company.Criteria>();
        CreateMap<DailyViewRoot.GroupStatistics.Company.QueryModel, DailyViewRoot.GroupStatistics.Company.Criteria>();
        CreateMap<DailyViewRoot.GroupStatistics.Company.QueryModel, DailyViewRoot.GroupStatistics.Company.Criteria>();
        CreateMap<DailyViewRoot.GroupStatistics.Device.QueryModel, DailyViewRoot.GroupStatistics.Device.Criteria>();
        CreateMap<DailyViewRoot.GroupStatistics.Device.QueryModel, DailyViewRoot.GroupStatistics.Device.Criteria>();
        CreateMap<DailyViewRoot.GroupStatistics.Device.QueryModel, DailyViewRoot.GroupStatistics.Device.Criteria>();
        CreateMap<DailyViewRoot.Main.QueryModel, DailyViewRoot.Main.Criteria>();
        CreateMap<DailyViewRoot.Main.QueryModel, DailyViewRoot.Main.Criteria>();
        CreateMap<DailyViewRoot.Main.QueryModel, DailyViewRoot.Main.Criteria>();
        CreateMap<DailyViewRoot.Main.Product.QueryModel, DailyViewRoot.Main.Product.Criteria>();
        CreateMap<DailyViewRoot.Main.Product.QueryModel, DailyViewRoot.Main.Product.Criteria>();
        CreateMap<DailyViewRoot.Main.Product.QueryModel, DailyViewRoot.Main.Product.Criteria>();
    }
}