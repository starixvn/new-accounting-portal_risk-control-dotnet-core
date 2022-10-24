using MediatR;
using RiskControl.WinLossLimitControl.GameRound.Model;
using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.GameRound.Request
{
    public class ProductGameTypeRequest : IRequest<IEnumerable<ProductGameTypeModel>>
    {
    }
}