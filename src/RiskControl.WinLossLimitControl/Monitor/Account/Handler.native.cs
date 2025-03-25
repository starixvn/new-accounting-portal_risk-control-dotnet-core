using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Monitor.Account.Criteria;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using RiskControl.AssociatedAcccount;
using RiskControl.WinLossLimitControl.Constants;

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

    private async Task<CustomerViewModel> GetCustomer(int customerId)
    {
        var criteria = new CustomerQueryCriteria { CustomerId = customerId };
        var rawData = await repository.FetchAsync<Customer>(criteria);
        var member = rawData.FirstOrDefault(x => x.RoleId == RoleConstant.Member)?? new Customer();
        var agent = rawData.FirstOrDefault(x => x.RoleId == RoleConstant.Agent)?? new Customer();
        var master = rawData.FirstOrDefault(x => x.RoleId == RoleConstant.Master)??new Customer();
        var super = rawData.FirstOrDefault(x => x.RoleId == RoleConstant.Super)??new Customer();
        return new CustomerViewModel
        {
            CustId = member.CustId,
            Username = member.Username,
            AgentId = agent.CustId,
            Agent = agent.Username,
            MasterId = master.CustId,
            Master = master.Username,
            SuperId = super.CustId,
            Super = super.Username,
            IsCreditUser = member.IsCreditUser,
            SiteName = member.SiteName
        };
    }
}