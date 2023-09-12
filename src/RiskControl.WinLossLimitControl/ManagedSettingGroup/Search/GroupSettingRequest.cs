using MediatR;
using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search;

public class GroupSettingRequest : IRequest<IEnumerable<GroupGroupSettingModel>>
{
    public int ProductID { get; set; }
}