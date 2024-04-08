using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;
using RiskControl.NonSportsGamesStatistics.Hourly;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class HourlyProfile : Profile
{
    public HourlyProfile()
    {
        CreateMap<QueryModel, Criteria>();
        CreateMap<QueryModelExcel, Criteria>();

        CreateMap<HourlyRawStatistics, HourlyStatistics>();
    }
}