using System;
using System.Runtime.Serialization;

namespace RiskControl.ProgressiveJackpot.ApiModel
{
    [Serializable]
    public class ApiException : Exception, ISerializable
    {
        public ApiException(string message) : base(message)
        {
        }

        protected ApiException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }


        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            base.GetObjectData(info, context);
        }
    }
}
