using AutoMapper;
using Headline = RiskControl.NonSportsGamesStatistics.Headline;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class HeadlineProfile : Profile
{
    public HeadlineProfile()
    {
        CreateMap<Headline.Main.Request, Headline.Main.Criteria>();
    }
}