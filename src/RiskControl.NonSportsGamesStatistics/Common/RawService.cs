using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;

namespace RiskControl.NonSportsGamesStatistics.Common;

public interface RawService
{
    Task<IEnumerable<T>> QueryData<T>(BaseStatisticCriteria criteria, DateTime winLossDate) where T : class;

    Task<GenericRawData<T>> QueryMultipleData<T>(BaseStatisticCriteria criteria, DateTime winLossDate)
        where T : class;

    Task<GenericRawData<T>> QueryDataFromBettransAndWarehouse<T>(BaseHistoryCriteria historyCriteria, BaseNormalCriteria normalCriteria)
        where T : class;
}

public class RawServiceImp(DataSourceChooser dataSourceChooser, IDynamicRepository repository)
    : RawService
{
    public Task<IEnumerable<T>> QueryData<T>(BaseStatisticCriteria criteria, DateTime winLossDate)
        where T : class
    {
        criteria.Source = dataSourceChooser.GetDataSource(criteria.IsNormalMode);
        return repository.FetchAsync<T>(criteria);
    }

    public async Task<GenericRawData<T>> QueryMultipleData<T>(BaseStatisticCriteria criteria, DateTime winLossDate)
        where T : class
    {
        var statistics = new GenericRawData<T>();

        criteria.Source = dataSourceChooser.GetDataSource(criteria.IsNormalMode);
        var rawData = await repository.FetchMultipleAsync<T, T>(criteria).ConfigureAwait(false);

        statistics.RawStatistics = rawData.Item1 ?? new List<T>();
        statistics.Total = rawData.Item2 ?? new List<T>();

        return statistics;
    }

    public async Task<GenericRawData<T>> QueryDataFromBettransAndWarehouse<T>(BaseHistoryCriteria historyCriteria, BaseNormalCriteria normalCriteria)
        where T : class
    {
        var today = DateTime.Today;
        var yesterday = DateTime.Today.AddDays(-1);
        var tempDate = historyCriteria.ToDate;
        var todayRawData = new GenericRawData<T>();
        var yesterdayRawData = new GenericRawData<T>();
        var warehouseRawData = new GenericRawData<T>();
        var rawData = new GenericRawData<T>();

        if (tempDate > yesterday)
        {
            normalCriteria.WinLostDate = today;
            todayRawData = await QueryMultipleData<T>(normalCriteria, today);
            tempDate = yesterday;
        }

        if (tempDate == yesterday && historyCriteria.FromDate <= yesterday)
        {
            normalCriteria.WinLostDate = yesterday;
            yesterdayRawData = await QueryMultipleData<T>(normalCriteria, yesterday);
            historyCriteria.ToDate = yesterday.AddDays(-1);
            tempDate = yesterday.AddDays(-1);
        }

        if (tempDate < yesterday && historyCriteria.FromDate < yesterday)
        {
            warehouseRawData = await QueryMultipleData<T>(historyCriteria, tempDate).ConfigureAwait(false);
        }

        rawData.RawStatistics = warehouseRawData.RawStatistics.Concat(yesterdayRawData.RawStatistics).Concat(todayRawData.RawStatistics);
        rawData.Total = warehouseRawData.Total.Concat(yesterdayRawData.Total).Concat(todayRawData.Total);

        return rawData;
    }
}