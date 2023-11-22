using System;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Constants;

namespace RiskControl.NonSportsGamesStatistics.TopTwenty.Main.History;

using Attributes;

public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
{
    public DateTime FromDate { get; set; }

    [DateRangeLessThan("FromDate", DateRangeConstant.MAX_MONTH)]
    public DateTime ToDate { get; set; }

    public bool IsDrillDown { get; set; }

    public int TopType { get; set; }

    public int RoleId { get; set; }
}