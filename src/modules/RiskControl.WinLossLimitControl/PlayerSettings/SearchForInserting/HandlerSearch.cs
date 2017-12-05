using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.PlayerSettings.Search;
using RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.SearchForInserting
{
    public class HandlerSearch : HandlerBase, IAsyncRequestHandler<RequestSearch, List<PlayerSettingCurrency>>
    {
        private readonly IDynamicRepository dynamicRepository;

        public HandlerSearch(IDynamicRepository dynamicRepository, CacheRefService cacheRefService, DataTransformService dataTransformService)
            : base(cacheRefService, dataTransformService)
        {
            this.dynamicRepository = dynamicRepository;
        }

        public async Task<List<PlayerSettingCurrency>> Handle(RequestSearch message)
        {
            var criteria = Mapper.Map<SearchCriteria>(message);
            var rawSettings = await dynamicRepository.FetchAsync<PlayerSettingRaw>(criteria).ConfigureAwait(false);

            var settings = FromRawPlayerSetting(rawSettings);

            return GetPlayerSettingCurrencies(settings).ToList();
        }
    }
}