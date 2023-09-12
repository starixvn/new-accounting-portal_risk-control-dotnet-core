using MediatR;
using RiskControl.WinLossLimitControl.Models;
using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Update;

public class GameGroupSettingRequest : IRequest<ExecuteResult>
{
    public IEnumerable<GameGroupSettingModel> Settings { get; set; }
}