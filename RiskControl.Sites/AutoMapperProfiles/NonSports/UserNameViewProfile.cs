
using AutoMapper;
using AssociatedAccount = RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount;
using GrandTotal = RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal;
using HousePositionTaking = RiskControl.NonSportsGamesStatistics.UserNameView.HousePositionTaking;
using RiskControl.NonSportsGamesStatistics.UserNameView.Main;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class UserNameViewProfile : Profile
{
    public UserNameViewProfile()
    {
        CreateMap<HousePositionTaking.QueryModel, HousePositionTaking.Criteria>();

        CreateMap<QueryModelExcel, Criteria>();
        CreateMap<AssociatedAccount.QueryModel, AssociatedAccount.Criteria>();
        CreateMap<GrandTotal.QueryModel, GrandTotal.Criteria>();
        CreateMap<QueryModel, Criteria>();
        CreateMap<QueryModel, Criteria>();
        CreateMap<QueryModel, Criteria>();
    }
}