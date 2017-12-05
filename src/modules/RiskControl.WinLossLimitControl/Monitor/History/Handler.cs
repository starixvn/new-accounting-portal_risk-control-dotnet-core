using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Monitor.Parser;

namespace RiskControl.WinLossLimitControl.Monitor.History
{
    public class Handler : IAsyncRequestHandler<Request, List<WinLimitHistory>>
    {
        private readonly IDynamicRepository repository;

        private readonly CacheRefService cacheRefService;

        private readonly WinLimitSettingXmlParser winLimitSettingXmlParser;

        public Handler(IDynamicRepository repository, CacheRefService cacheRefService, WinLimitSettingXmlParser winLimitSettingXmlParser)
        {
            this.repository = repository;
            this.cacheRefService = cacheRefService;
            this.winLimitSettingXmlParser = winLimitSettingXmlParser;
        }

        public async Task<List<WinLimitHistory>> Handle(Request message)
        {
            var criteria = Mapper.Map<HistoryCriteria>(message);
            var rawData = await repository.FetchAsync<WinLimitHistoryRaw>(criteria).ConfigureAwait(false);
            return FromRawWinLimitHistory(rawData).ToList();
        }

        private IEnumerable<WinLimitHistory> FromRawWinLimitHistory(IEnumerable<WinLimitHistoryRaw> rawData)
        {
            foreach (var item in rawData)
            {
                var winLimitSetting = winLimitSettingXmlParser.Parse(item.MaxWinLimitSetting);

                yield return new WinLimitHistory
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
                    ProceededBy = item.ProceededBy
                };
            }
        }
    }
}