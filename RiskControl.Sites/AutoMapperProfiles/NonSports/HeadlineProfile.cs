using AutoMapper;
using Headline = RiskControl.NonSportsGamesStatistics.Headline;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class HeadlineProfile : Profile
{
    public HeadlineProfile()
    {
        CreateMap<Headline.Main.Request, Headline.Main.Criteria>();
        CreateMap<Headline.SMA.Request, Headline.SMA.Criteria>();
        CreateMap<Headline.Main.Request, Headline.Main.NormalCriteria>();
        CreateMap<Headline.SMA.Request, Headline.SMA.NormalCriteria>();
    }
}