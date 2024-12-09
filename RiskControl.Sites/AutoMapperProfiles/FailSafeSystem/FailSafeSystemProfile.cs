using AutoMapper;
using RiskControl.FailSafeSystem.Model;

namespace RiskControl.Sites.AutoMapperProfiles.FailSafeSystem;

public class FailSafeSystemProfile : Profile
{
    public FailSafeSystemProfile()
    {
        CreateMap<SettingRuleModel, SettingViewModel>();
    }
}