using System;
using System.Collections.Generic;
using MediatR;
using RiskControl.WinLossLimitControl.GameRound.Model;

namespace RiskControl.WinLossLimitControl.GameRound.Request;

public class BetLimitMonitorQueryRequest : IRequest<List<BetLimitMonitorModel>>
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public string ProductId { get; set; }

    public string BetType { get; set; }

    public bool ExcludeTestData { get; set; }
}