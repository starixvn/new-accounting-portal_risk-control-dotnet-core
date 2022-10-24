using System;
using System.Collections.Generic;
using RiskControl.ProgressiveJackpot.Model;

namespace RiskControl.ProgressiveJackpot.ApiModel
{
    public class ApiResult<T>
    {
        public DateTime TimeStamp { get; set; }

        public ResultDescription Result { get; set; }

        public T Content { get; set; }
    }

    public class GameGroupResultContent
    {
        public List<GameGroupModel> GameGroups { get; set; }
    }

    public class GameTypeResultContent
    {
        public List<GameTypeModel> GameTypes { get; set; }
    }

    public class JackpotTypeResultContent
    {
        public List<JackpotTypeModel> JackpotTypes { get; set; }
    }

    public class ReportRealTimeResultContent
    {
        public List<ReportRealTimeModel> PJRealtimeReports { get; set; }
    }

    public class ReportMonthlyResultContent
    {
        public List<ReportMonthlyModel> PJMonthlyReports { get; set; }
    }

    public class ReportDailyResultContent
    {
        public List<ReportDailyModel> PJDailyReports { get; set; }
    }

    public class ReportWinnerRecordResultContent
    {
        public List<ReportWinRecordModel> PJWinnerReports { get; set; }
    }
}
