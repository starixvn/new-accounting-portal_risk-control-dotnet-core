namespace RiskControl.WebApiClient;

using System;
using System.Net;

public class RichHttpClientException : Exception
{
    public RichHttpClientException(HttpStatusCode statusCode)
    {
        StatusCode = (int)statusCode;
    }

    public int StatusCode { get; set; }

    public override string Message => StatusCode.ToString();
}
