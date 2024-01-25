namespace RiskControl.AssociatedAcccount;

using Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface AssociatedAccountService
{
    Task <List<AssociationModel>> GetAssociatedCustomer(int custId);
}

public class AssociatedAccountServiceImp(ConfigurationService configurationService,
        CustomerTrackingSystemApiService customerTrackingSystemApiService): AssociatedAccountService
{
    public async Task<List<AssociationModel>> GetAssociatedCustomer(int custId)
    {
        var associationModel = await customerTrackingSystemApiService.GetAssociatedCustomer(
            configurationService.FraudSystemCTSAPI,
            custId).ConfigureAwait(false);

        if (associationModel == null)
        {
            return new List<AssociationModel>();
        }

        return associationModel;
    }
}