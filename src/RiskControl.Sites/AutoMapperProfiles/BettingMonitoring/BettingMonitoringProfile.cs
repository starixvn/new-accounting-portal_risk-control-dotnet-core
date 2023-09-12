using AutoMapper;
using RiskControl.BettingMonitoring.Criteria;
using RiskControl.BettingMonitoring.Models;
using QueryRoot = RiskControl.BettingMonitoring.Query;
using UpdateRoot = RiskControl.BettingMonitoring.Update;


namespace RiskControl.Sites.AutoMapperProfiles.BettingMonitoring;

public class BettingMonitoringProfile : Profile
{
    public BettingMonitoringProfile()
    {
        CreateMap<QueryRoot.Message, BettingMonitoringModel>();
        CreateMap<UpdateRoot.Message, BettingMonitoringModel>();
        CreateMap<BettingMonitoringModel, BettingMonitoringUpdateCriteria>();
    }
}