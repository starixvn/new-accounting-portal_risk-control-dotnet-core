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
        var associationModel = await associatedAccountService.GetAssociatedAccount(request.CustId);

        return new AccountModel
        {
            Customer = customer,
            Associations = associationModel
        };
    }

    private Task<Customer> GetCustomer(int customerId)
    {
        var criteria = new CustomerQueryCriteria { CustomerId = customerId };
        return repository.GetAsync<Customer>(criteria);
    }
}