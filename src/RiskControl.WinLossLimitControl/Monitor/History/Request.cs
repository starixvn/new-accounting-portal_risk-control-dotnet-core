using System.Collections.Generic;
using MediatR;

namespace RiskControl.WinLossLimitControl.Monitor.History;

public class Request : IRequest<List<WinLimitHistory>>
{
    public int ProductId { get; set; }

    public int CustId { get; set; }
}