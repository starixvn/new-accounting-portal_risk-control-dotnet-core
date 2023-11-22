using System;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.AssociatedAccount.History;

using Attributes;

public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
{
    public DateTime FromDate { get; set; }

    [DateRangeLessThan("FromDate", DateRangeConstant.MAX_MONTH)]
    public DateTime ToDate { get; set; }

    public bool IsDrillDown { get; set; }

    public int RoleId { get; set; }

    public bool IsGrandTotal { get; set; }

    public int CustId { get; set; }
}