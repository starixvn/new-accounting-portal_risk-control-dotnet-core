using Fanex.Excel.Models;
using MediatR;

namespace RiskControl.NonSportsGamesStatistics.Headline.Main;

public class Request: BaseRequestModel, IRequest<GridOptions>
{
    public int CustId { get; set; }
}