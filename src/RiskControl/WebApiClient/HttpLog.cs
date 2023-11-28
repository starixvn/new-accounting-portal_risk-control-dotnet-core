namespace RiskControl.WebApiClient;

public class HttpLog(string requestUri, object requestData)
{
    public string RequestUri { get; set; } = requestUri;

    public object RequestData { get; set; } = requestData;

    public object ResponseData { get; set; }
}
