using System;
using System.Runtime.Serialization;

namespace RiskControl.ProgressiveJackpot.ApiModel;

[Serializable]
public class ApiException : Exception
{
    public ApiException(string message) : base(message)
    {
    }

    protected ApiException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }
}