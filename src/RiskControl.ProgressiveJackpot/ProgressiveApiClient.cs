using System.Threading.Tasks;
using Olympus.WebApiClient;
using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot
{
    public interface ProgressiveApiClient
    {
        Task<T> PostJson<T>(string request, object postData);
    }

    public class ProgressiveApiClientImp : ProgressiveApiClient
    {
        private readonly RichHttpClient richHttpClient;

        public ProgressiveApiClientImp(RichHttpClient richHttpClient)
        {
            this.richHttpClient = richHttpClient;
        }

        public async Task<T> PostJson<T>(string request, object postData)
        {
            var apiResult = await richHttpClient.PostJson<ApiResult<T>>(request, postData).ConfigureAwait(false);
            if (apiResult.Result.ErrorCode != 0)
            {
                throw new ApiException(apiResult.Result.ErrorDescription);
            }

            return apiResult.Content;
        }

    }
}
