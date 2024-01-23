using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Monitor.Account.Criteria;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using RiskControl.AssociatedAcccount;

namespace RiskControl.WinLossLimitControl.Monitor.Account;

public class Handler(IDynamicRepository repository,
        AssociatedAccountService associatedAccountService)
    : IRequestHandler<Request, AccountModel>
{
    public async Task<AccountModel> Handle(Request request, CancellationToken cancellationToken)
    {
        var customer = await GetCustomer(request.CustId);
        var accountsByDevice = await associatedAccountService.GetAssociatedByDevice(request.CustId);
        var accountsByIP = await associatedAccountService.GetAssociateddByIp(request.CustId);
        var accountsByManual = await associatedAccountService.GetAssociatedByManual(request.CustId);

        return new AccountModel
        {
            Customer = customer,
            UsersByDevice = accountsByDevice,
            UsersByIP = accountsByIP,
            UsersByManual = accountsByManual
        };
    }

    private Task<Customer> GetCustomer(int customerId)
    {
        var criteria = new CustomerQueryCriteria { CustomerId = customerId };
        return repository.GetAsync<Customer>(criteria);
    }
}