using System.Collections.Generic;
using MediatR;

namespace RiskControl.WinLossLimitControl.Groups;

public class Request : IRequest<List<ProductGroupSetting>>
{
}