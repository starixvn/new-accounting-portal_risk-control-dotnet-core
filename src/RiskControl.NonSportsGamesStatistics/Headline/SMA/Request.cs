using Fanex.Excel.Models;
using MediatR;

namespace RiskControl.NonSportsGamesStatistics.Headline.SMA;

public class Request : BaseRequestModel, IRequest<GridOptions>
{
    public int Headline { get; set; }
}