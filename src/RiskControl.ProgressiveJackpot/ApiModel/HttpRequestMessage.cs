using System;

namespace RiskControl.ProgressiveJackpot.ApiModel;

public class HttpRequestMessage<T> where T : BaseCallMessage
{
    public HttpRequestMessage()
    {
        TimeStamp = DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss.fff");
    }

    public string TimeStamp { get; }

    public T Call { get; set; }
}