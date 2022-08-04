using AutoMapper;
using RiskControl.WinLossLimitControl.ManagedSettingGroup.Search;
using RiskControl.WinLossLimitControl.ManagedSettingGroup.Update;

namespace RiskControl.Sites.App_Start.AutoMapperProfiles.WinLossLimitControl
{
    public class ManagedSettingGroupProfile : Profile
    {
        public ManagedSettingGroupProfile()
        {
            CreateMap<RepresentativeBettypeRequest, RepresentativeBettypeCriteria>();
            CreateMap<UnassignedBettypeRequest, UnassignedBettypeCriteria>();
            CreateMap<GroupSettingRequest, GroupSettingCriteria>();
            CreateMap<GameGroupSettingModel, GameGroupSettingCriteria>();
        }
    }
}