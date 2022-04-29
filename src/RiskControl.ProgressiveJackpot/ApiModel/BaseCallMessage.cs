using System;

namespace RiskControl.ProgressiveJackpot.ApiModel
{
    public class BaseCallMessage
    {
        protected BaseCallMessage()
        {
            Seq = Guid.NewGuid().ToString();
        }

        public string Seq { get; }
    }
}
