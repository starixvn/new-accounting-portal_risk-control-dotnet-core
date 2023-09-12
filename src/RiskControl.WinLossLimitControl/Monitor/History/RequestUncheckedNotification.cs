using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.Monitor.History;

public class RequestUncheckedNotification: IRequest<ExecuteResult>
{
    public int CustId { get; set; }
    public long LogID { get; set; }
}