using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Constants;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Search;

public class Handler : IRequestHandler<Request, List<SettingSite>>
{
    private readonly CacheRefService cacheRefService;

    private readonly DataTransformService dataTransformService;

    private readonly IDynamicRepository repository;

    private readonly IMapper mapper;

    public Handler(IDynamicRepository repository, CacheRefService cacheRefService,
        DataTransformService dataTransformService, IMapper mapper)
    {
        this.repository = repository;
        this.cacheRefService = cacheRefService;
        this.dataTransformService = dataTransformService;
        this.mapper = mapper;
    }

    public async Task<List<SettingSite>> Handle(Request request, CancellationToken cancellationToken)
    {
        var rawCurerncySettings = await QueryFromDatabase(request);
        var currencySettings = FromRawCurrencySetting(rawCurerncySettings);

        return GroupBySite(currencySettings)
            .OrderBy(g => g.SiteName)
            .ThenBy(g => g.CurrencyName)
            .ToList();
    }

    private async Task<IEnumerable<CurrencySettingRaw>> QueryFromDatabase(Request parameter)
    {
        var processingCriteria = parameter.MultiSite == "0"
            ? (ICriteria)new AllSiteSearchCriteria
            {
                ProductId = parameter.ProductId,
                CurrencyId = parameter.CurrencyId,
                GroupId = parameter.GroupId
            }
            : mapper.Map<SearchCriteria>(parameter);
        return await repository.FetchAsync<CurrencySettingRaw>(processingCriteria);
    }

    private IEnumerable<CurrencySetting> FromRawCurrencySetting(IEnumerable<CurrencySettingRaw> rawCurrencySetting)
    {
        var currencyGroups =
            rawCurrencySetting.GroupBy(x => new { x.ProductId, x.GroupId, x.CurrencyId, x.SiteId, x.IsCreditSite, x.IsSuspendedAccount });

        foreach (var group in currencyGroups)
        {
            var currencySetting = new CurrencySetting
            {
                ProductId = group.Key.ProductId,
                ProductName = cacheRefService.GetProductName(group.Key.ProductId),
                GroupId = group.Key.GroupId,
                GroupName = cacheRefService.GetGroupName(group.Key.GroupId),
                CurrencyId = group.Key.CurrencyId,
                CurrencyName = cacheRefService.GetCurrencyName(group.Key.CurrencyId),
                SiteId = group.Key.SiteId,
                SiteName = cacheRefService.GetSiteName(group.Key.SiteId),
                IsCreditSite = group.Key.IsCreditSite,
                IsBlockedPlacebetRedLevel =
                    group.Where(x => x.LevelId == LimitLevelConstant.RedLevel)
                        .Select(x => x.IsBlockedPlaceBet)
                        .FirstOrDefault(),
                IsBlockedTransferRedLevel =
                    group.Where(x => x.LevelId == LimitLevelConstant.RedLevel)
                        .Select(x => x.IsBlockedTransfer)
                        .FirstOrDefault(),
                IsSuspendedAccount = group.Key.IsSuspendedAccount
            };

            dataTransformService.UpdateFromRaw(currencySetting, group.ToList<WinLossLimitRaw>());

            yield return currencySetting;
        }
    }

    private static IEnumerable<SettingSite> GroupBySite(IEnumerable<CurrencySetting> settings)
    {
        var groups =
            settings.GroupBy(
                s => new { s.ProductId, s.ProductName, s.SiteId, s.SiteName, s.CurrencyId, s.CurrencyName, s.IsSuspendedAccount });
        foreach (var group in groups)
        {
            var settingByGroup = group
                .Select(g => new SettingGroup
                {
                    ProductId = group.Key.ProductId,
                    CurrencyId = group.Key.CurrencyId,
                    SiteId = group.Key.SiteId,
                    IsCreditSite = g.IsCreditSite,
                    GroupId = g.GroupId,
                    GroupName = g.GroupName,
                    IsBlockedPlacebetRedLevel = g.IsBlockedPlacebetRedLevel,
                    IsBlockedTransferRedLevel = g.IsBlockedTransferRedLevel,
                    BlackLimit = g.BlackLimit,
                    GreyLimit = g.GreyLimit,
                    OrangeLimit = g.OrangeLimit,
                    YellowLimit = g.YellowLimit,
                    RedLimit = g.RedLimit
                })
                .OrderBy(g => g.GroupName)
                .ToList();
            var settingSite = new SettingSite
            {
                ProductName = group.Key.ProductName,
                SiteName = group.Key.SiteName,
                CurrencyName = group.Key.CurrencyName,
                Groups = settingByGroup,
                IsSuspendedAccount = group.Key.IsSuspendedAccount
            };

            yield return settingSite;
        }
    }
}