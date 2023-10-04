using AutoMapper;
using RiskControl.WinLossLimitControl.CurrencySettings.Search;
using Update = RiskControl.WinLossLimitControl.CurrencySettings.Update;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;

namespace RiskControl.Sites.AutoMapperProfiles.WinLossLimitControl;

public class CurrencySettingProfile : Profile
{
    public CurrencySettingProfile()
    {
        CreateMap<Request, SearchCriteria>();
        CreateMap<UpdateInactiveSiteModel, Update.UpdateInactiveSiteCriteria>();
    }
}