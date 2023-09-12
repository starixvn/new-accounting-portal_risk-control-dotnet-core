using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model;

public class ReportCallMessage : BaseCallMessage
{
    public int GameGroupId { get; set; }

    public int GameTypeId { get; set; }

    public int JackpotTypeId { get; set; }
}