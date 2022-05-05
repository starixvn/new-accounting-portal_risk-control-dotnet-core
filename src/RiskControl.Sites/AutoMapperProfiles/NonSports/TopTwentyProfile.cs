using AutoMapper;
using TopTwentyRoot = RiskControl.NonSportsGamesStatistics.TopTwenty;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports
{
    public class TopTwentyProfile : Profile
    {
        public TopTwentyProfile()
        {
            CreateMap<TopTwentyRoot.GroupStatistics.History.QueryModel, TopTwentyRoot.GroupStatistics.History.Criteria>();
            CreateMap<TopTwentyRoot.GroupStatistics.Normal.QueryModel, TopTwentyRoot.GroupStatistics.Normal.Criteria>();
            CreateMap<TopTwentyRoot.Main.History.QueryModel, TopTwentyRoot.Main.History.Criteria>();
            CreateMap<TopTwentyRoot.Main.Normal.QueryModel, TopTwentyRoot.Main.Normal.Criteria>();
        }
    }
}
