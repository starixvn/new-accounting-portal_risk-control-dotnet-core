using MediatR;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search;

public class RepresentativeBettypeRequest : IRequest<RepresentativeBettypeModel>
{
    public int ProductID { get; set; }
}