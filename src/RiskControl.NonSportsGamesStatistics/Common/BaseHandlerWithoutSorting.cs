using System;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Excel.Models;

namespace RiskControl.NonSportsGamesStatistics.Common
{
    public class BaseHandlerWithoutSorting<TQueryModel, TCriteria, TReportModel>
        where TQueryModel : BaseStatisticQueryModel
        where TCriteria : BaseStatisticCriteria
        where TReportModel : class
    {
        private readonly Service<TReportModel, TCriteria> service;
        private readonly GridOptionBuilderService<TReportModel, TQueryModel> gridOptionService;

        protected BaseHandlerWithoutSorting(
              Service<TReportModel, TCriteria> service,
              GridOptionBuilderService<TReportModel, TQueryModel> gridOptionService)
        {
            this.service = service;
            this.gridOptionService = gridOptionService;
        }

        protected virtual async Task<GridOptions> Handle(TQueryModel queryModel, DateTime winLossDate)
        {
            var config = new MapperConfiguration(cfg => cfg.CreateMap<TQueryModel, TCriteria>());
            var mapper = new Mapper(config);
            var criteria = mapper.Map<TCriteria>(queryModel);

            var reportModel = await service.Query(criteria, winLossDate).ConfigureAwait(false);

            var gridOptions = gridOptionService.BuildGridOptions(reportModel, queryModel);

            return gridOptions;
        }
    }
}