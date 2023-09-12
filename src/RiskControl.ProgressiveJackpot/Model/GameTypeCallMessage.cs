using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model;

public class GameTypeCallMessage : BaseCallMessage
{
    public int GameGroupId { get; set; }
}