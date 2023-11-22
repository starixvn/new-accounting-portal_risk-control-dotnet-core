namespace RiskControl.WebApiClient;

using System;
using System.Net;

public class RichHttpClientException(HttpStatusCode statusCode) : Exception
{
    public int StatusCode { get; set; } = (int)statusCode;

    public override string Message => StatusCode.ToString();
}
