using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock;

public class RequestUnblockTransfer : Request, IRequest<ExecuteResult>
{
}