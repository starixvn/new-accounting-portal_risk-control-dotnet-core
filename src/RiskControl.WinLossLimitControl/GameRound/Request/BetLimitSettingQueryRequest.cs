using System.Collections.Generic;
using MediatR;
using RiskControl.WinLossLimitControl.GameRound.Model;

namespace RiskControl.WinLossLimitControl.GameRound.Request;

public class BetLimitSettingQueryRequest : IRequest<List<BetLimitSettingModel>>
{
    public string ProductId { get; set; }
}