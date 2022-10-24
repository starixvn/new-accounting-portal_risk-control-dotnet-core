using System.Collections.Generic;
using System.Linq;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Filter.Criteria;
using RiskControl.WinLossLimitControl.Filter.Model;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.Filter
{
    public interface BaseEntityGroupLoaderService
    {
        BaseEntityGroup GetBaseEntityGroup();
    }

    public class BaseEntityGroupLoaderServiceImp : BaseEntityGroupLoaderService
    {
        private readonly IDynamicRepository repository;

        public BaseEntityGroupLoaderServiceImp(IDynamicRepository repository)
        {
            this.repository = repository;
        }

        public BaseEntityGroup GetBaseEntityGroup()
        {
            return new BaseEntityGroup
            {
                Currencies = GetAllCurrencies(),
                Groups = GetAllGroups(),
                Products = GetAllProducts(),
                Sites = GetAllSites()
            };
        }

        private IDictionary<int, string> GetAllCurrencies()
        {
            var criteria = new GetAllCurrencyCriteria();
            return repository.Fetch<BaseEntity>(criteria)
                    .ToDictionary(x => x.Id, x => x.Name);
        }

        private IDictionary<int, string> GetAllGroups()
        {
            var criteria = new GetAllGroupCriteria();
            return repository.Fetch<BaseEntity>(criteria)
                    .ToDictionary(x => x.Id, x => x.Name);
        }

        private IDictionary<int, string> GetAllProducts()
        {
            var criteria = new GetAllProductCriteria();
            return repository.Fetch<BaseEntity>(criteria)
                    .ToDictionary(x => x.Id, x => x.Name);
        }

        private IDictionary<int, string> GetAllSites()
        {
            var criteria = new GetAllSiteCriteria();
            return repository.Fetch<BaseEntity>(criteria)
                    .ToDictionary(x => x.Id, x => x.Name);
        }
    }
}