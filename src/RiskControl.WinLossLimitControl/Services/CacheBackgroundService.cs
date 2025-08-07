using System;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Services;

using System.Threading;
using Fanex.Data.Repository;
using Microsoft.Extensions.Hosting;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Groups;

public class CacheBackgroundService(IDynamicRepository repository, CacheRefService cacheRefService) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(TimeSpan.FromSeconds(15), stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            await ReloadCache();
            await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
        }
    }

    private async Task ReloadCache()
    {
        try
        {
            var criteria = new ReadCriteria();
            var settings = await repository.FetchAsync<GroupSetting>(criteria);

            var sportIds = settings.Select(s => s.SportId).Distinct().ToList();
            var betTypeIds = settings.Select(s => s.BetTypeId).Distinct().ToList();

            cacheRefService.ReloadCache(sportIds, betTypeIds);
        }
        catch
        {
            // ignored
        }
    }
}