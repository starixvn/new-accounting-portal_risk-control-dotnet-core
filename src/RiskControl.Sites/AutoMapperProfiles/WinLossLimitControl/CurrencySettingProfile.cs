using AutoMapper;
using RiskControl.WinLossLimitControl.CurrencySettings.Search;

namespace RiskControl.Sites.AutoMapperProfiles.WinLossLimitControl
{
    public class CurrencySettingProfile : Profile
    {
        public CurrencySettingProfile()
        {
            CreateMap<Request, SearchCriteria>();
        }
    }
}