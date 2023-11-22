using System.Threading.Tasks;
using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot;

using System;
using WebApiClient;

public interface ProgressiveApiClient
{
    Task<T> PostJson<T>(string request, object postData);
}

public class ProgressiveApiClientImp(RichHttpClient richHttpClient) : ProgressiveApiClient
{
    public async Task<T> PostJson<T>(string request, object postData)
    {
        var apiResult = await richHttpClient.PostJson<ApiResult<T>>(request, postData).ConfigureAwait(false);
        if (apiResult.Result.ErrorCode != 0)
        {
            throw new InvalidOperationException(apiResult.Result.ErrorDescription);
        }

        return apiResult.Content;
    }

}