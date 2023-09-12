using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;

namespace RiskControl.VoidRejectRefund.Common;

public interface Service
{
    Task<StatisticReportModel> Query(HttpParameterJsonBase message);
}

public class ServiceImp : Service
{
    private readonly IDynamicRepository repository;

    private readonly IMapper mapper;

    public ServiceImp(IDynamicRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<StatisticReportModel> Query(HttpParameterJsonBase message)
    {
        var criteria = mapper.Map<Criteria>(message);
        var statisticEntities = await repository.FetchMultipleAsync<StatisticEntity, StatisticEntity>(criteria).ConfigureAwait(false);

        return new StatisticReportModel
        {
            Statistics = mapper.Map<List<StatisticModel>>(statisticEntities.Item1),
            GrandTotal = mapper.Map<StatisticModel>(statisticEntities.Item2.FirstOrDefault())
        };

    }
}