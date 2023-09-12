using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting;

public class RequestValidation : IRequest<ExecuteResult>
{
    public string Username { get; set; }
}