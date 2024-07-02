using MediatR;

namespace RiskControl.NonSportsGamesStatistics.SavedFilter.Requests;

public class ExecuteFilterRequest: IRequest<int>
{
    public int QueryId { get; set; }

    public string QueryName { get; set; }

    public byte Action { get; set; }

    public int UserId { get; set; }

    public int ReportId { get; set; }

    public string ReportName { get; set; }

    public string Content { get; set; }
}