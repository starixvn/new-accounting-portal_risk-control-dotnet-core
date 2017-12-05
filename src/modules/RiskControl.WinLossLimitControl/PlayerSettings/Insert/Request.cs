using System.Collections.Generic;
using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert
{
    public class Request : List<PlayerSetting>, IRequest<ExecuteResult>
    {
    }
}