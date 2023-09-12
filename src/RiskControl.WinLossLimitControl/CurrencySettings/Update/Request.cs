using System.Collections.Generic;
using MediatR;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update;

public class Request : List<CurrencySetting>, IRequest<ExecuteResult>
{
}