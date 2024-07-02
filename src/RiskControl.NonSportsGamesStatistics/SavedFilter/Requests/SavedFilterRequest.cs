using MediatR;
using RiskControl.NonSportsGamesStatistics.SavedFilter.Model;
using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.SavedFilter.Requests;

public class SavedFilterRequest: IRequest<IEnumerable<SavedFilterModel>>
{
    public int QueryId { get; set; }

    public string QueryName { get; set; }

    public byte Action { get; set; }

    public int UserId { get; set; }

    public int ReportId { get; set; }

    public string ReportName { get; set; }

    public string Content { get; set; }
}