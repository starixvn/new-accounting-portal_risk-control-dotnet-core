using System;
using MediatR;
using OfficeOpenXml;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main.Normal;

public class QueryModelExcel : BaseStatisticQueryModel, IRequest<ExcelPackage>
{
    public DateTime WinLostDate { get; set; }

    public bool IsDrillDown { get; set; }

    public int RoleId { get; set; }

    public bool IsGrandTotal { get; set; }
}