using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using RiskControl.VoidRejectRefund.Common;

namespace RiskControl.VoidRejectRefund.Product
{
    public interface ProductService
    {
        Task<ProductModel> Query(HttpParameterJsonBase message);
    }

    public class ProductServiceImp : ProductService
    {
        private readonly IDynamicRepository repository;

        private readonly IMapper mapper;

        public ProductServiceImp(IDynamicRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<ProductModel> Query(HttpParameterJsonBase message)
        {
            var criteria = mapper.Map<Criteria>(message);
            var statisticEntities = await repository.FetchMultipleAsync<ProductLeagueSportBettypeEntity, ProductLeagueSportBettypeEntity>(criteria).ConfigureAwait(false);

            return new ProductModel
            {
                ProductStatistics = CalculateProductStatistics(statisticEntities.Item1),
                GrandTotal = mapper.Map<ProductLeagueSportBettypeStatistic>(statisticEntities.Item2.FirstOrDefault())
            };
        }

        private List<ProductStatistic> CalculateProductStatistics(IEnumerable<ProductLeagueSportBettypeEntity> entities)
        {
            var productGroups = entities.GroupBy(x => x.ProductId);

            var result = from @group in productGroups
                         let productEntities = entities.Where(x => x.ProductId == @group.Key)
                         select CalculatePerProductStatistic(productEntities);

            return result.ToList();
        }

        private ProductStatistic CalculatePerProductStatistic(IEnumerable<ProductLeagueSportBettypeEntity> productEntities)
        {
            var leagueSportBettypeGroups = productEntities.Where(x => x.LeagueSportBettypeId != 0).GroupBy(x => x.LeagueSportBettypeId);

            var leagueSportBettypes = from @group in leagueSportBettypeGroups
                                      let leagueSportBettype = productEntities.Where(x => x.LeagueSportBettypeId == @group.Key && x.LeagueSportBettypeId != 0)
                                      select CalculateLeagueSportBettypeStatistic(leagueSportBettype);

            return new ProductStatistic
            {
                Total = mapper.Map<ProductLeagueSportBettypeStatistic>(productEntities.FirstOrDefault(x => x.LeagueSportBettypeId == 0)),
                LeagueSportBettypes = leagueSportBettypes.ToList()
            };
        }

        private LeagueSportBettypeStatistic CalculateLeagueSportBettypeStatistic(IEnumerable<ProductLeagueSportBettypeEntity> leagueSportBettypeEntities)
        {
            return new LeagueSportBettypeStatistic
            {
                Total = mapper.Map<ProductLeagueSportBettypeStatistic>(leagueSportBettypeEntities.FirstOrDefault(x => x.BettypeId == 0)),
                Bettypes = mapper.Map<List<ProductLeagueSportBettypeStatistic>>(leagueSportBettypeEntities.Where(x => x.BettypeId != 0))

            };
        }
    }
}
