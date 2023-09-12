using AutoMapper;
using GrandTotal = RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal;
using Main = RiskControl.NonSportsGamesStatistics.CurrencyView.Main;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class CurrencyViewProfile : Profile
{
    public CurrencyViewProfile()
    {
        CreateMap<Main.Normal.QueryModel, Main.Normal.Criteria>();
        CreateMap<Main.History.QueryModel, Main.History.Criteria>();

        CreateMap<GrandTotal.Normal.QueryModel, GrandTotal.Normal.Criteria>();
        CreateMap<GrandTotal.History.QueryModel, GrandTotal.History.Criteria>();
    }
}