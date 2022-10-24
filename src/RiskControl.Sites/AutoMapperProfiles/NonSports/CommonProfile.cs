using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Entities;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports
{
    public class CommonProfile : Profile
    {
        public CommonProfile()
        {
            CreateMap<BaseRawStatistic, UserNameViewRawStatistics>();
            CreateMap<BaseRawStatistic, DailyViewStatisticsModel>();
            CreateMap<BaseRawStatistic, DailyStatisticModel>();
            CreateMap<UserNameViewRawStatistics, UserNameViewStatisticsModel>();
            CreateMap<UsernameValidationQueryModel, ValidUsernameCriteria>();
            CreateMap<ValidationUsernameQueryModel, ValidationUsernameCriteria>();

            CreateMap<SiteGroupEntity, SiteGroupModel>();
            CreateMap<LicenseeEntity, LicenseeModel>();
            CreateMap<LicenseeModel, SiteGroupModel>();
        }
    }
}