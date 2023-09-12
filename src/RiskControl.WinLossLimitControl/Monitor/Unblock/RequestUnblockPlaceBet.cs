using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock;

public class RequestUnblockPlaceBet : Request, IRequest<ExecuteResult>
{
}