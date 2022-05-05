using AutoMapper;
using History = RiskControl.WinLossLimitControl.Monitor.History;
using Search = RiskControl.WinLossLimitControl.Monitor.Search;
using Unblock = RiskControl.WinLossLimitControl.Monitor.Unblock;

namespace RiskControl.Sites.AutoMapperProfiles.WinLossLimitControl
{
    public class MonitorProfile : Profile
    {
        public MonitorProfile()
        {
            CreateMap<History.Request, History.HistoryCriteria>();
            CreateMap<Search.Request, Search.MonitorSearchCriteria>();
            CreateMap<History.RequestUncheckedNotification, History.UncheckedNotificationCriteria>();
            CreateMap<Unblock.RequestUnblockPlaceBet, Unblock.ServiceParameter>();
            CreateMap<Unblock.RequestUnblockTransfer, Unblock.ServiceParameter>();
            CreateMap<Unblock.ServiceParameter, Unblock.Criteria.WinLimitCustGameStatusPlaceBetUnblockCriteria>();
            CreateMap<Unblock.ServiceParameter, Unblock.Criteria.WinLimitCustGameStatusTransferUnblockCriteria>();
            CreateMap<Unblock.ServiceParameter, Unblock.Criteria.WinLimitCustGameMonitoringHistoryInsertCriteria>();
        }
    }
}