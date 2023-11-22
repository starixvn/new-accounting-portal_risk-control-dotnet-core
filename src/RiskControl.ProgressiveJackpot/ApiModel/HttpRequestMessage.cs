using System;

namespace RiskControl.ProgressiveJackpot.ApiModel;

public class HttpRequestMessage<T> where T : BaseCallMessage
{
    public string TimeStamp { get; } = DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss.fff");

    public T Call { get; set; }
}