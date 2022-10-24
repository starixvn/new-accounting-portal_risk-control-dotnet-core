using MediatR;
using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search
{
    public class UnassignedBettypeRequest : IRequest<IEnumerable<UnassignedBettypeModel>>
    {
        public int ProductID { get; set; }
    }
}
