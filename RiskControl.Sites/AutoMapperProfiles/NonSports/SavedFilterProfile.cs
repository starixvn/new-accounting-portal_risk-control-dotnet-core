using AutoMapper;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Criteria;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Requests;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class SavedFilterProfile: Profile
{
	public SavedFilterProfile()
	{
		CreateMap<ExecuteFilterRequest, SavedFilterCriteria>();
		CreateMap<SavedFilterRequest, SavedFilterCriteria>();
	}
}