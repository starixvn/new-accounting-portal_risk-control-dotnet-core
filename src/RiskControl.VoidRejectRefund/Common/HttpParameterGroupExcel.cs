using MediatR;
using OfficeOpenXml;

namespace RiskControl.VoidRejectRefund.Common;

public class HttpParameterGroupExcel : HttpParameterExcelBase, IRequest<ExcelPackage>
{
}