using MediatR;

namespace RiskControl.VoidRejectRefund.Common;

public class HttpParameterGroupJson : HttpParameterJsonBase, IRequest<GroupStatisticReportModel>
{
}