using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Filter;

namespace RiskControl.WinLossLimitControl.Groups
{
    public class Handler : IAsyncRequestHandler<Request, List<ProductGroupSetting>>
    {
        private readonly IDynamicRepository repository;

        private readonly CacheRefService cacheRefService;

        public Handler(IDynamicRepository repository, CacheRefService cacheRefService)
        {
            this.repository = repository;
            this.cacheRefService = cacheRefService;
        }

        public async Task<List<ProductGroupSetting>> Handle(Request message)
        {
            var criteria = new ReadCriteria();
            var settings = await repository.FetchAsync<GroupSetting>(criteria).ConfigureAwait(false);

            var result = new List<ProductGroupSetting>();
            var productIds = settings.Select(s => s.ProductId).Distinct();

            foreach (var productId in productIds)
            {
                var groupSettings = settings.Where(s => s.ProductId == productId).ToList();
                var groups = groupSettings.GroupBy(s => s.GroupId)
                    .Select(g => new GroupBetTypeSetting
                    {
                        GroupName = cacheRefService.GetGroupName(g.Key),
                        BetTypes = g.Select(b => cacheRefService.GetBetTypeName(b.BetTypeId)).Distinct().ToList()
                    })
                    .ToList();

                var productGroupSetting = new ProductGroupSetting
                {
                    ProductId = productId,
                    ProductName = cacheRefService.GetProductName(productId),
                    Groups = groups
                };

                result.Add(productGroupSetting);
            }

            return result;
        }
    }
}