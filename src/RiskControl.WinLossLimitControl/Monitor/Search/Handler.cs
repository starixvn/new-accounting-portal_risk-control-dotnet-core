using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Monitor.Parser;

namespace RiskControl.WinLossLimitControl.Monitor.Search;

public class Handler(IDynamicRepository repository, CacheRefService cacheRefService,
        WinLimitSettingXmlParser winLimitSettingXmlParser, IMapper mapper)
    : IRequestHandler<Request, List<MonitorModel>>
{
    public async Task<List<MonitorModel>> Handle(Request request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<MonitorSearchCriteria>(request);
        criteria.ToDate = criteria.ToDate.AddDays(1).AddSeconds(-1);
        var rawData = await repository.FetchAsync<MonitorModelRaw>(criteria, cancellationToken);
        return FromRawWinLimitMonitor(rawData).ToList();
    }

    private IEnumerable<MonitorModel> FromRawWinLimitMonitor(IEnumerable<MonitorModelRaw> rawData)
    {
        return rawData.Select(item =>
        {
            var winLimitSetting = winLimitSettingXmlParser.Parse(item.MaxWinLimitSetting);
            return new MonitorModel
            {
                CustId = item.CustId,
                UserName = item.UserName,
                SiteId = item.SiteId,
                SiteName = cacheRefService.GetSiteName(item.SiteId),
                CurrencyId = item.CurrencyId,
                CurrencyName = cacheRefService.GetCurrencyName(item.CurrencyId),
                ProductId = item.ProductId,
                ProductName = cacheRefService.GetProductName(item.ProductId),
                GroupId = item.GroupId,
                GroupName = cacheRefService.GetGroupName(item.GroupId),
                WinningAmount = item.TotalWinAmount,
                WinningAmountRM = item.TotalWinAmountRM,
                ReachedLimitTime = $"{item.ReachedLimitTime:MM/d/yyyy h:mm:ss tt}",
                ReachedLimitLevel = item.ReachedLimitLevel,
                NumberReachedLimit = item.NumberReachedLimit,
                IsNotified = item.IsNotified,
                IsBlockedPlaceBet = item.IsBlockedPlaceBet,
                IsBlockedTransfer = item.IsBlockedTransfer,
                IsEnableUnblock = item.IsEnableUnblock,
                BlackLimit = winLimitSetting.BlackLimit,
                GreyLimit = winLimitSetting.GreyLimit,
                OrangeLimit = winLimitSetting.OrangeLimit,
                YellowLimit = winLimitSetting.YellowLimit,
                RedLimit = winLimitSetting.RedLimit,
                IsSuspendedAccount = item.IsSuspendedAccount
            };
        });
    }
}