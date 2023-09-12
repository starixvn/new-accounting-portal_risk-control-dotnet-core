using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;

namespace RiskControl.VoidRejectRefund.Common;

public interface GroupService
{
    Task<GroupStatisticReportModel> Query(HttpParameterJsonBase message);
}

public class GroupServiceImp : GroupService
{
    private readonly IDynamicRepository repository;

    private readonly IMapper mapper;

    public GroupServiceImp(IDynamicRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<GroupStatisticReportModel> Query(HttpParameterJsonBase message)
    {
        var criteria = mapper.Map<Criteria>(message);

        var statisticEntities = await repository.FetchMultipleAsync<StatisticEntity, StatisticEntity>(criteria).ConfigureAwait(false);

        var statistics = mapper.Map<IEnumerable<StatisticModel>>(statisticEntities.Item1);
        var total = mapper.Map<IEnumerable<StatisticModel>>(statisticEntities.Item2);

        var parentGroups = statistics.GroupBy(x => x.GroupName);

        var groupStatistics = from @group in parentGroups
            let groupStatistic = statistics.Where(x => x.GroupName == @group.Key)
            let groupTotal = total.FirstOrDefault(x => x.ReportBy == $"{@group.Key} Total")
            select CalculateStatisticForPerGroup(groupStatistic, groupTotal);

        return new GroupStatisticReportModel
        {
            Statistics = groupStatistics.ToList(),
            GrandTotal = total.FirstOrDefault(x => x.ReportBy == "Grand Total")
        };
    }

    private static GroupStatisticModel CalculateStatisticForPerGroup(IEnumerable<StatisticModel> statistics, StatisticModel total)
    {
        var childGroups = statistics.GroupBy(x => x.ReportBy);

        var groupStatistics = from @group in childGroups
            let groupStatistic = statistics.Where(x => x.ReportBy == @group.Key)
            select new ChildGroupStatisticModel { GroupName = @group.Key, Statistics = groupStatistic.ToList() };

        return new GroupStatisticModel
        {

            Total = total,
            Statistics = groupStatistics.ToList()
        };
    }
}