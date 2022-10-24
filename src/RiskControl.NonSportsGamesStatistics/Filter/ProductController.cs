using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter
{
    [ApiController]
    [Route("NonSportsGamesStatistics/Product")]
    public class ProductController : ControllerBase
    {
        private readonly IDynamicRepository repository;

        public ProductController(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        [Route("Query")]
        [HttpGet]
        public async Task<List<ProductModel>> Query()
        {
            var criteria = new ProductCriteria();
            return await repository.FetchAsync<ProductModel>(criteria).ConfigureAwait(false) as List<ProductModel>;
        }
    }
}