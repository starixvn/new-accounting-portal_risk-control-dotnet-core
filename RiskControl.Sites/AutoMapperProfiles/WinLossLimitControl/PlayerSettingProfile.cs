using AutoMapper;
using Delete = RiskControl.WinLossLimitControl.PlayerSettings.Delete;
using Search = RiskControl.WinLossLimitControl.PlayerSettings.Search;
using SearchForInserting = RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting;
using Update = RiskControl.WinLossLimitControl.PlayerSettings.Update;

namespace RiskControl.Sites.AutoMapperProfiles.WinLossLimitControl;

public class PlayerSettingProfile : Profile
{
    public PlayerSettingProfile()
    {
        CreateMap<Search.Request, Search.SearchCriteria>();
        CreateMap<Delete.Request, Delete.DeleteCriteria>();
        CreateMap<SearchForInserting.RequestSearch, SearchForInserting.SearchCriteria>();
        CreateMap<SearchForInserting.RequestValidation, SearchForInserting.ValidationCriteria>();
        CreateMap<Update.Request, Update.UpdateCriteria>();
    }
}