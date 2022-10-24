using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model
{
    public class ReportDailyCallMessage : BaseCallMessage
    {
        public int PJMainId { get; set; }

        public int Level { get; set; }
        public string Month { get; set; }
    }
}
