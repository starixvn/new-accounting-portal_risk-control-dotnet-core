using MediatR;

namespace RiskControl.VoidRejectRefund.Common
{
    public class HttpParameterJson : HttpParameterJsonBase, IRequest<StatisticReportModel>
    {
    }
}
