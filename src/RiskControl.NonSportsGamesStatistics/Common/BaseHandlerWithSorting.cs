using System;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Excel.Models;

namespace RiskControl.NonSportsGamesStatistics.Common;

public class BaseHandlerWithSorting<TQueryModel, TCriteria, TReportModel>
    where TQueryModel : BaseStatisticQueryModel
    where TCriteria : BaseStatisticCriteria
    where TReportModel : class
{
    private readonly GridOptionBuilderService<TReportModel, TQueryModel> gridOptionService;
    private readonly Service<TReportModel, TCriteria> service;
    private readonly SortingService<TReportModel> sortingService;

    protected BaseHandlerWithSorting(
        Service<TReportModel, TCriteria> service,
        SortingService<TReportModel> sortingService,
        GridOptionBuilderService<TReportModel, TQueryModel> gridOptionService)
    {
        this.service = service;
        this.sortingService = sortingService;
        this.gridOptionService = gridOptionService;
    }

    protected virtual async Task<GridOptions> Handle(TQueryModel queryModel, DateTime winLossDate)
    {
        var sortColumnName = queryModel.SortColumnName;
        var sortDirection = queryModel.SortDirection;
        var config = new MapperConfiguration(cfg => cfg.CreateMap<TQueryModel, TCriteria>());
        var mapper = new Mapper(config);
        var criteria = mapper.Map<TCriteria>(queryModel);

        var reportModel = await service.Query(criteria, winLossDate).ConfigureAwait(false);

        if (!string.IsNullOrEmpty(sortColumnName) && !string.IsNullOrEmpty(sortDirection))
        {
            reportModel = sortingService.SortData(reportModel, sortDirection, sortColumnName);
        }

        var gridOptions = gridOptionService.BuildGridOptions(reportModel, queryModel);

        return gridOptions;
    }
}