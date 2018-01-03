using AutoMapper;

namespace RiskControl.WinLossLimitControl
{
    public static class AutoMapperConfiguration
    {
        public static void InitializeWinLossLimitControl(this IProfileExpression cfg)
        {
            cfg.CreateMap<CurrencySettings.Search.Request, CurrencySettings.Search.SearchCriteria>();
            cfg.CreateMap<Monitor.History.Request, Monitor.History.HistoryCriteria>();
            cfg.CreateMap<Monitor.Search.Request, Monitor.Search.MonitorSearchCriteria>();
            cfg.CreateMap<Monitor.Unblock.RequestUnblockPlaceBet, Monitor.Unblock.ServiceParameter>();
            cfg.CreateMap<Monitor.Unblock.RequestUnblockTransfer, Monitor.Unblock.ServiceParameter>();
            cfg.CreateMap<Monitor.Unblock.ServiceParameter, Monitor.Unblock.Criteria.WinLimitCustGameStatusPlaceBetUnblockCriteria>();
            cfg.CreateMap<Monitor.Unblock.ServiceParameter, Monitor.Unblock.Criteria.WinLimitCustGameStatusTransferUnblockCriteria>();
            cfg.CreateMap<Monitor.Unblock.ServiceParameter, Monitor.Unblock.Criteria.WinLimitCustGameMonitoringHistoryInsertCriteria>();
            cfg.CreateMap<PlayerSettings.Delete.Request, PlayerSettings.Delete.DeleteCriteria>();
            cfg.CreateMap<PlayerSettings.Search.Request, PlayerSettings.Search.SearchCriteria>();
            cfg.CreateMap<PlayerSettings.SearchForInserting.RequestSearch, PlayerSettings.SearchForInserting.SearchCriteria>();
            cfg.CreateMap<PlayerSettings.SearchForInserting.RequestValidation, PlayerSettings.SearchForInserting.ValidationCriteria>();
            cfg.CreateMap<PlayerSettings.Update.Request, PlayerSettings.Update.UpdateCriteria>();            
        }
    }
}