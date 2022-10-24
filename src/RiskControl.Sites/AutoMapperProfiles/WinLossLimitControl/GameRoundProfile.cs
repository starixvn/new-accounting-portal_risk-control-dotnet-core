using AutoMapper;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Request;

namespace RiskControl.Sites.AutoMapperProfiles.WinLossLimitControl
{
    public class GameRoundProfile : Profile
    {
        public GameRoundProfile()
        {
            CreateMap<BetLimitSettingQueryRequest, BetLimitSettingQueryCriteria>();
            CreateMap<BetLimitSettingUpdateRequest, BetLimitSettingUpdateCommand>();
            CreateMap<BetLimitMonitorQueryRequest, BetLimitMonitorQueryCriteria>();
            CreateMap<BetLimitMonitorQueryExcelRequest, BetLimitMonitorQueryCriteria>();
            CreateMap<ProductGameTypeRequest, ProductGameTypeCriteria>();
        }
    }
}