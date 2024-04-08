using AutoMapper;
using GrandTotal = RiskControl.NonSportsGamesStatistics.CurrencyView.GrandTotal;
using Main = RiskControl.NonSportsGamesStatistics.CurrencyView.Main;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class CurrencyViewProfile : Profile
{
    public CurrencyViewProfile()
    {
        CreateMap<Main.QueryModel, Main.Criteria>();

        CreateMap<GrandTotal.QueryModel, GrandTotal.Criteria>();
    }
}