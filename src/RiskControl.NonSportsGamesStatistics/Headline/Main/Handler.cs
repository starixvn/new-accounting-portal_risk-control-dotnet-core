using AutoMapper;
using Fanex.Excel.Models;
using MediatR;
using RiskControl.Sort;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Headline.Main;

public class Handler(Service service, IMapper mapper) : IRequestHandler<Request, GridOptions>
{
    public async Task<GridOptions> Handle(Request request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<Criteria>(request);
        var data = await service.QueryData(criteria);
        if (!string.IsNullOrEmpty(request.SortColumnName) && !string.IsNullOrEmpty(request.SortDirection))
        {
            data = SortData(data, request.SortDirection, request.SortColumnName);
        }
        var gridOptions = service.BuildGridOpions(data, request);
        return gridOptions;
    }

    private static ViewModel SortData(ViewModel data, string sortDirection, string sortColumnName)
    {
        var propInfo = typeof(StatisticsModel).GetProperty(sortColumnName);
        var isAsc = string.Equals(sortDirection, SortingInformation.Ascending, StringComparison.OrdinalIgnoreCase);
        data.Statistics = isAsc ?
            data
                .Statistics
                .OrderBy(s => propInfo.GetValue(s, null))
                 :
            data
                .Statistics
                .OrderByDescending(s => propInfo.GetValue(s, null));
        return data;
    }
}