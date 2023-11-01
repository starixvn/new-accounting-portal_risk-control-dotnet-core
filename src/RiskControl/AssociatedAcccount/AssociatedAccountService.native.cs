namespace RiskControl.AssociatedAcccount;

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Configuration;
using Fanex.Data.Repository;
using Olympus.FPSAPI.Client;

public interface AssociatedAccountService
{
    Task<IEnumerable<TopAssociatedAccount>> GetAssociatedByDevice(int custId);

    Task<IEnumerable<TopAssociatedAccount>> GetAssociatedByManual(int custId);

    Task<IEnumerable<TopAssociatedAccount>> GetAssociateddByIp(int custId);
}

public class AssociatedAccountServiceImp : AssociatedAccountService
{
    private const int AssociatedByDevice = 1;
    private const int AssociatedByManual = 2;
    private const int AssociatedByIp = 3;

    private readonly ConfigurationService configurationService;
    private readonly FraudServiceWrapper fraudServiceWrapper;
    private readonly IDynamicRepository repository;

    public AssociatedAccountServiceImp(ConfigurationService configurationService,
        FraudServiceWrapper fraudServiceWrapper,
        IDynamicRepository repository)
    {
        this.configurationService = configurationService;
        this.fraudServiceWrapper = fraudServiceWrapper;
        this.repository = repository;
    }

    public async Task<IEnumerable<TopAssociatedAccount>> GetAssociatedByDevice(int custId)
    {
        var associatedByDevice = await fraudServiceWrapper.GetAssociatedCustomerByDeviceOrManual(
            configurationService.FraudSystemCTSAPI,
            custId,
            AssociatedByDevice).ConfigureAwait(false);

        if (associatedByDevice == null)
        {
            return new List<TopAssociatedAccount>();
        }

        var usernames = associatedByDevice.Select(x => x.Username);
        var usernameValues = string.Join(",", usernames);
        var criteria = new TopAssociatedAccountCriteria
        {
            Username = usernameValues,
            Type = AssociatedByDevice
        };

        return await repository.FetchAsync<TopAssociatedAccount>(criteria);
    }

    public async Task<IEnumerable<TopAssociatedAccount>> GetAssociatedByManual(int custId)
    {
        var associatedByManual = await fraudServiceWrapper.GetAssociatedCustomerByDeviceOrManual(
            configurationService.FraudSystemCTSAPI,
            custId,
            AssociatedByManual).ConfigureAwait(false);

        if (associatedByManual == null)
        {
            return new List<TopAssociatedAccount>();
        }

        var usernames = associatedByManual.Select(x => x.Username);
        var usernameValues = string.Join(",", usernames);
        var criteria = new TopAssociatedAccountCriteria
        {
            Username = usernameValues,
            Type = AssociatedByManual
        };

        return await repository.FetchAsync<TopAssociatedAccount>(criteria);
    }

    public async Task<IEnumerable<TopAssociatedAccount>> GetAssociateddByIp(int custId)
    {
        var associatedByIp = await fraudServiceWrapper.GetAssociatedCustomersByIp(
            configurationService.FraudSystemCTSAPI,
            custId).ConfigureAwait(false);

        if (associatedByIp == null)
        {
            return new List<TopAssociatedAccount>();
        }

        var custIds = associatedByIp.Select(x => x.CustID.ToString());
        var custIdValues = string.Join(",", custIds);
        var criteria = new TopAssociatedAccountCriteria
        {
            Username = custIdValues,
            Type = AssociatedByIp
        };

        return await repository.FetchAsync<TopAssociatedAccount>(criteria);
    }
}