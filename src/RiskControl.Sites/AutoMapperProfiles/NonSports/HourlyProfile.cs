using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using History = RiskControl.NonSportsGamesStatistics.Hourly.History;
using Normal = RiskControl.NonSportsGamesStatistics.Hourly.Normal;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports
{
    public class HourlyProfile : Profile
    {
        public HourlyProfile()
        {
            CreateMap<History.QueryModel, History.Criteria>();
            CreateMap<History.QueryModelExcel, History.Criteria>();

            CreateMap<Normal.QueryModel, Normal.Criteria>();
            CreateMap<Normal.QueryModelExcel, Normal.Criteria>();

            CreateMap<HourlyRawStatistics, HourlyStatistics>();
        }
    }
}