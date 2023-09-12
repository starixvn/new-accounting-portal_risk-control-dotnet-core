using MediatR;
using OfficeOpenXml;
using RiskControl.VoidRejectRefund.Common;

namespace RiskControl.VoidRejectRefund.Product;

public class HttpParameterExcel : HttpParameterExcelBase, IRequest<ExcelPackage>
{
}