using AutoMapper;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using AssociatedAccount = RiskControl.NonSportsGamesStatistics.SpecificMember.AssociatedAccount;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class AssociatedAccountProfile : Profile
{
    public AssociatedAccountProfile()
    {
        CreateMap<AssociatedAccount.Criteria, UsernameHistoryCriteria>();
        CreateMap<AssociatedAccount.Criteria, UsernameNormalCriteria>();
    }
}