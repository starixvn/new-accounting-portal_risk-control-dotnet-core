using AutoMapper;
using Fanex.Data.Repository;
using Fanex.Excel.Models;
using RiskControl.Sort;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Headline;

public class BaseHandler<TRequestModel, TCriteria>(Service service, IMapper mapper)
    where TRequestModel : BaseRequestModel
    where TCriteria : ICriteria
{
    public async Task<GridOptions> Handle(TRequestModel request)
    {
        var criteria = mapper.Map<TCriteria>(request);
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