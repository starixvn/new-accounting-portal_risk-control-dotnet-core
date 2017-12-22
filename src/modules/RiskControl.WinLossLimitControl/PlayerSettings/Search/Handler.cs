using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.PlayerSettings.Search.Model;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Search
{
    public class Handler : HandlerBase, IRequestHandler<Request, List<PlayerSettingCurrency>>
    {
        private readonly IDynamicRepository repository;

        public Handler(IDynamicRepository repository, CacheRefService cacheRefService, DataTransformService dataTransformService)
            : base(cacheRefService, dataTransformService)
        {
            this.repository = repository;
        }

        public async Task<List<PlayerSettingCurrency>> Handle(Request request, CancellationToken cancellationToken)
        {
            var criteria = Mapper.Map<SearchCriteria>(request);
            var rawSettings = await repository.FetchAsync<PlayerSettingRaw>(criteria).ConfigureAwait(false);
            var settings = FromRawPlayerSetting(rawSettings);

            return GetPlayerSettingCurrencies(settings)
                    .OrderBy(g => g.SiteName)
                    .ThenBy(g => g.CurrencyName)
                    .ToList();
        }
    }
}