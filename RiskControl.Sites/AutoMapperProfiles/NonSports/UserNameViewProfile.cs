
using AutoMapper;
using AssociatedAccount = RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount;
using GrandTotal = RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal;
using History = RiskControl.NonSportsGamesStatistics.UserNameView.Main.History;
using HousePositionTaking = RiskControl.NonSportsGamesStatistics.UserNameView.HousePositionTaking;
using Normal = RiskControl.NonSportsGamesStatistics.UserNameView.Main.Normal;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class UserNameViewProfile : Profile
{
    public UserNameViewProfile()
    {
        CreateMap<HousePositionTaking.QueryModel, HousePositionTaking.Criteria>();

        CreateMap<History.QueryModelExcel, History.Criteria>();
        CreateMap<Normal.QueryModelExcel, Normal.Criteria>();
        CreateMap<AssociatedAccount.History.QueryModel, AssociatedAccount.History.Criteria>();
        CreateMap<AssociatedAccount.Normal.QueryModel, AssociatedAccount.Normal.Criteria>();
        CreateMap<GrandTotal.History.QueryModel, GrandTotal.History.Criteria>();
        CreateMap<GrandTotal.Normal.QueryModel, GrandTotal.Normal.Criteria>();
        CreateMap<History.QueryModel, History.Criteria>();
        CreateMap<History.QueryModel, History.Criteria>();
        CreateMap<History.QueryModel, History.Criteria>();
        CreateMap<Normal.QueryModel, Normal.Criteria>();
        CreateMap<Normal.QueryModel, Normal.Criteria>();
        CreateMap<Normal.QueryModel, Normal.Criteria>();
    }
}