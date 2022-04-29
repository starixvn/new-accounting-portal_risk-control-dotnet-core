using MediatR;

namespace RiskControl.WinLossLimitControl.Monitor.Account
{
    public class Request : IRequest<AccountModel>
    {
        public int CustId { get; set; }
    }
}