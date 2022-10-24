using MediatR;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Update
{
    public class Request : IRequest<ExecuteResult>
    {
        public int CustId { get; set; }

        public int ProductId { get; set; }

        public int GroupId { get; set; }

        public int LevelId { get; set; }

        public decimal Limit { get; set; }
    }
}