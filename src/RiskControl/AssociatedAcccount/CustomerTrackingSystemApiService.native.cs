using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace RiskControl.AssociatedAcccount;

public interface CustomerTrackingSystemApiService
{
    Task<List<AssociationModel>> GetAssociatedCustomer(string host, int custId);
}

public class CustomerTrackingSystemApiServiceImp : CustomerTrackingSystemApiService
{
    static HttpClient jsonClient = new();

    public async Task<List<AssociationModel>> GetAssociatedCustomer(string host, int custId)
    {
        jsonClient.DefaultRequestHeaders.Accept.Clear();
        jsonClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var path = $"{host}/Association/GetByCustId?custId={custId}";
        var response = await jsonClient.GetAsync(path).ConfigureAwait(false);
        var responseData = response.IsSuccessStatusCode
            ? await response.Content.ReadAsStringAsync().ConfigureAwait(false)
            : string.Empty;

        return JsonConvert.DeserializeObject<List<AssociationModel>>(responseData);
    }
}