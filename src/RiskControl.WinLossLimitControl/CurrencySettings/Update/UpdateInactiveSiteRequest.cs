using MediatR;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.Models;
using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update;

public class UpdateInactiveSiteRequest : IRequest<ExecuteResult>
{
    public IEnumerable<UpdateInactiveSiteModel> Settings { get; set; }
}