using AutoMapper;
using DailyViewRoot = RiskControl.NonSportsGamesStatistics.DailyView;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports
{
    public class DailyViewProfile : Profile
    {
        public DailyViewProfile()
        {
            CreateMap<DailyViewRoot.Daily.History.QueryModel, DailyViewRoot.Daily.History.Criteria>();
            CreateMap<DailyViewRoot.Daily.History.QueryModel, DailyViewRoot.Daily.History.Criteria>();
            CreateMap<DailyViewRoot.Daily.History.QueryModel, DailyViewRoot.Daily.History.Criteria>();
            CreateMap<DailyViewRoot.Daily.Normal.QueryModel, DailyViewRoot.Daily.Normal.Criteria>();
            CreateMap<DailyViewRoot.Daily.Normal.QueryModel, DailyViewRoot.Daily.Normal.Criteria>();
            CreateMap<DailyViewRoot.Daily.Normal.QueryModel, DailyViewRoot.Daily.Normal.Criteria>();
            CreateMap<DailyViewRoot.GrandTotal.DailyGrandTotalHistory.QueryModel, DailyViewRoot.GrandTotal.DailyGrandTotalHistory.Criteria>();
            CreateMap<DailyViewRoot.GrandTotal.DailyGrandTotalNormal.QueryModel, DailyViewRoot.GrandTotal.DailyGrandTotalNormal.Criteria>();
            CreateMap<DailyViewRoot.GrandTotal.DailyViewGrandTotalHistory.QueryModel, DailyViewRoot.GrandTotal.DailyViewGrandTotalHistory.Criteria>();
            CreateMap<DailyViewRoot.GrandTotal.DailyViewGrandTotalNormal.QueryModel, DailyViewRoot.GrandTotal.DailyViewGrandTotalNormal.Criteria>();
            CreateMap<DailyViewRoot.GrandTotal.ProductGrandTotalHistory.QueryModel, DailyViewRoot.GrandTotal.ProductGrandTotalHistory.Criteria>();
            CreateMap<DailyViewRoot.GrandTotal.ProductGrandTotalNormal.QueryModel, DailyViewRoot.GrandTotal.ProductGrandTotalNormal.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.CompanyHistory.QueryModel, DailyViewRoot.GroupStatistics.CompanyHistory.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.CompanyHistory.QueryModel, DailyViewRoot.GroupStatistics.CompanyHistory.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.CompanyHistory.QueryModel, DailyViewRoot.GroupStatistics.CompanyHistory.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.CompanyNormal.QueryModel, DailyViewRoot.GroupStatistics.CompanyNormal.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.CompanyNormal.QueryModel, DailyViewRoot.GroupStatistics.CompanyNormal.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.CompanyNormal.QueryModel, DailyViewRoot.GroupStatistics.CompanyNormal.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.DeviceHistory.QueryModel, DailyViewRoot.GroupStatistics.DeviceHistory.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.DeviceHistory.QueryModel, DailyViewRoot.GroupStatistics.DeviceHistory.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.DeviceHistory.QueryModel, DailyViewRoot.GroupStatistics.DeviceHistory.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.DeviceNormal.QueryModel, DailyViewRoot.GroupStatistics.DeviceNormal.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.DeviceNormal.QueryModel, DailyViewRoot.GroupStatistics.DeviceNormal.Criteria>();
            CreateMap<DailyViewRoot.GroupStatistics.DeviceNormal.QueryModel, DailyViewRoot.GroupStatistics.DeviceNormal.Criteria>();
            CreateMap<DailyViewRoot.Main.History.QueryModel, DailyViewRoot.Main.History.Criteria>();
            CreateMap<DailyViewRoot.Main.History.QueryModel, DailyViewRoot.Main.History.Criteria>();
            CreateMap<DailyViewRoot.Main.History.QueryModel, DailyViewRoot.Main.History.Criteria>();
            CreateMap<DailyViewRoot.Main.Normal.QueryModel, DailyViewRoot.Main.Normal.Criteria>();
            CreateMap<DailyViewRoot.Main.Normal.QueryModel, DailyViewRoot.Main.Normal.Criteria>();
            CreateMap<DailyViewRoot.Main.Normal.QueryModel, DailyViewRoot.Main.Normal.Criteria>();
            CreateMap<DailyViewRoot.Main.ProductHistory.QueryModel, DailyViewRoot.Main.ProductHistory.Criteria>();
            CreateMap<DailyViewRoot.Main.ProductHistory.QueryModel, DailyViewRoot.Main.ProductHistory.Criteria>();
            CreateMap<DailyViewRoot.Main.ProductHistory.QueryModel, DailyViewRoot.Main.ProductHistory.Criteria>();
            CreateMap<DailyViewRoot.Main.ProductNormal.QueryModel, DailyViewRoot.Main.ProductNormal.Criteria>();
            CreateMap<DailyViewRoot.Main.ProductNormal.QueryModel, DailyViewRoot.Main.ProductNormal.Criteria>();
            CreateMap<DailyViewRoot.Main.ProductNormal.QueryModel, DailyViewRoot.Main.ProductNormal.Criteria>();
        }
    }
}
