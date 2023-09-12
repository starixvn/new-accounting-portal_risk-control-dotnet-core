using MediatR;
using RiskControl.VoidRejectRefund.Common;

namespace RiskControl.VoidRejectRefund.Product;

public class HttpParameterJson : HttpParameterJsonBase, IRequest<ProductModel>
{
}