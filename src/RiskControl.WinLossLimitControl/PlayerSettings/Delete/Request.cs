using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Delete;

public class Request : IRequest<ExecuteResult>
{
    public int CustId { get; set; }

    public int ProductId { get; set; }

    public int GroupId { get; set; }
}