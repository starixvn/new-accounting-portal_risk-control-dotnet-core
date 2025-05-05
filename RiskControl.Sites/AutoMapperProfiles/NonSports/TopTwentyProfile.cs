using AutoMapper;
using TopTwentyRoot = RiskControl.NonSportsGamesStatistics.TopTwenty;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class TopTwentyProfile : Profile
{
    public TopTwentyProfile()
    {
        CreateMap<TopTwentyRoot.GroupStatistics.QueryModel, TopTwentyRoot.GroupStatistics.Criteria>();
        CreateMap<TopTwentyRoot.Main.QueryModel, TopTwentyRoot.Main.Criteria>();
    }
}