using System;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.GrandTotal.Normal
{
    public class QueryModel : BaseStatisticQueryModel, IRequest<GridOptions>
    {
        public DateTime WinLostDate { get; set; }

        public bool IsDrillDown { get; set; }

        public int RoleId { get; set; }

        public bool IsGrandTotal { get; set; }
    }
}