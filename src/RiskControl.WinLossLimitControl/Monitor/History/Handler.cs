using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Monitor.Parser;

namespace RiskControl.WinLossLimitControl.Monitor.History;

public class Handler : IRequestHandler<Request, List<WinLimitHistory>>
{
    private readonly IDynamicRepository repository;

    private readonly CacheRefService cacheRefService;

    private readonly WinLimitSettingXmlParser winLimitSettingXmlParser;

    private readonly IMapper mapper;

    public Handler(IDynamicRepository repository,
        CacheRefService cacheRefService,
        WinLimitSettingXmlParser winLimitSettingXmlParser,
        IMapper mapper)
    {
        this.repository = repository;
        this.cacheRefService = cacheRefService;
        this.winLimitSettingXmlParser = winLimitSettingXmlParser;
        this.mapper = mapper;
    }

    public async Task<List<WinLimitHistory>> Handle(Request request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<HistoryCriteria>(request);
        var rawData = await repository.FetchAsync<WinLimitHistoryRaw>(criteria, cancellationToken);
        return FromRawWinLimitHistory(rawData).ToList();
    }

    private IEnumerable<WinLimitHistory> FromRawWinLimitHistory(IEnumerable<WinLimitHistoryRaw> rawData)
    {
        return rawData.Select(item =>
        {
            var winLimitSetting = winLimitSettingXmlParser.Parse(item.MaxWinLimitSetting);

            return new WinLimitHistory
            {
                GroupName = cacheRefService.GetGroupName(item.GroupId),
                GroupId = item.GroupId,
                Currency = item.Currency,
                ModifiedDate = $"{item.ModifiedDate:MM/d/yyyy h:mm:ss tt}",
                BlackLimit = winLimitSetting.BlackLimit,
                GreyLimit = winLimitSetting.GreyLimit,
                OrangeLimit = winLimitSetting.OrangeLimit,
                YellowLimit = winLimitSetting.YellowLimit,
                RedLimit = winLimitSetting.RedLimit,
                WinningAmount = item.TotalWinAmount,
                WinningAmountRM = item.TotalWinAmountRM,
                ReachedLimitLevel = item.ReachedLimitLevel,
                ActionName = item.ActionName,
                ProceededBy = item.ProceededBy,
                LogID = item.LogID,
                IsNotified = item.IsNotified
            };
        });
    }
}