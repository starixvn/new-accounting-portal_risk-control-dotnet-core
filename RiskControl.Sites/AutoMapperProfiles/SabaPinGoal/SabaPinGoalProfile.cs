using AutoMapper;
using RiskControl.SabaPinGoal.Criteria;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.Sites.AutoMapperProfiles.SabaPinGoal;

public class SabaPinGoalProfile : Profile
{
    public SabaPinGoalProfile()
    {
        CreateMap<QueryModel, DailyCriteria>();
        CreateMap<QueryModel, ProductSportCriteria>();
        CreateMap<QueryModel, ProductLeagueCriteria>();
    }
}