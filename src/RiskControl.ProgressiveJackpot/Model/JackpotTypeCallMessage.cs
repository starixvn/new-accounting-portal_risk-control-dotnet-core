using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model
{
    public class JackpotTypeCallMessage : BaseCallMessage
    {
        public int GameGroupId { get; set; }

        public int GameTypeId { get; set; }
    }
}
