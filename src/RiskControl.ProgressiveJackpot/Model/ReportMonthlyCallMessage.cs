using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model;

public class ReportMonthlyCallMessage : BaseCallMessage
{
    public int PJMainId { get; set; }

    public int Level { get; set; }
}