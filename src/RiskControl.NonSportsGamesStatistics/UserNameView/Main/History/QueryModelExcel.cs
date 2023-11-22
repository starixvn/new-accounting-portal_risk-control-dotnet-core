using System;
using MediatR;
using OfficeOpenXml;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main.History;

using Attributes;

public class QueryModelExcel : BaseStatisticQueryModel, IRequest<ExcelPackage>
{
    public DateTime FromDate { get; set; }

    [DateRangeLessThan("FromDate", DateRangeConstant.MAX_MONTH)]
    public DateTime ToDate { get; set; }

    public bool IsDrillDown { get; set; }

    public int RoleId { get; set; }

    public bool IsGrandTotal { get; set; }
}