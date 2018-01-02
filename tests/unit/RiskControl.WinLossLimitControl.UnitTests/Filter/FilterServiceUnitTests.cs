using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Filter.Criteria;
using RiskControl.WinLossLimitControl.Filter.Model;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.UnitTests.Filter
{
    public class FilterServiceUnitTests
    {
        [Fact]
        public async Task GetCurrencies_Always_ReturnsDataFromRepository()
        {
            // Arrange
            var currency = new BaseEntity { Id = 1, Name = "Currency 1" };
            var currencies = new List<BaseEntity> { currency };
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<BaseEntity>(Arg.Any<ICriteria>()).Returns(currencies);

            var cacheRefService = Substitute.For<CacheRefService>();

            // Act
            var service = new FilterServiceImp(repository, cacheRefService);
            var result = await service.GetCurrencies(new GetCurrencyCriteria());

            // Assert
            DeepAssert.Equal(result, currencies);
        }

        [Fact]
        public void GetProducts_Always_ReturnsDataFromCacheRefService()
        {
            // Arrange
            var repository = Substitute.For<IDynamicRepository>();

            var baseEntityGroup = new BaseEntityGroup
            {
                Products = new Dictionary<int, string>
                {
                    { 1, "Product 1" }
                }
            };

            var cacheRefService = Substitute.For<CacheRefService>();
            cacheRefService.BaseEntityGroup.Returns(baseEntityGroup);

            // Act
            var service = new FilterServiceImp(repository, cacheRefService);
            var result = service.GetProducts().ToList();

            // Assert
            var expected = new List<BaseEntity> { new BaseEntity { Id = 1, Name = "Product 1" } };
            DeepAssert.Equal(result, expected);
        }

        [Fact]
        public async Task GetSiteByProduct_Always_ReturnDataFromRepository()
        {
            // Arrange
            var site = new Site
            {
                SiteId = 1,
                SiteName = "Site 1",
                GroupName = "Group 1"
            };
            var sites = new List<Site>
            {
               site
            };

            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<Site>(Arg.Any<ICriteria>()).Returns(sites);

            var cacheRefService = Substitute.For<CacheRefService>();

            // Act
            var service = new FilterServiceImp(repository, cacheRefService);
            var result = await service.GetSiteByProduct(new GetSiteCriteria());

            // Assert
            var siteGroup = new SiteGroup
            {
                GroupName = "Group 1",
                Sites = sites
            };
            var expected = new List<SiteGroup> { siteGroup };

            DeepAssert.Equal(result.ToList(), expected);
        }

        [Fact]
        public async Task SearchUsers_Always_ReturnDataFromRepository()
        {
            // Arrange
            var customer = new Customer { CustId = 1, Username = "Username 1" };
            var customers = new List<Customer> { customer };
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<Customer>(Arg.Any<ICriteria>()).Returns(customers);

            var cacheRefService = Substitute.For<CacheRefService>();

            // Act
            var service = new FilterServiceImp(repository, cacheRefService);
            var result = await service.SearchUsers(new CustomerSuggestionCriteria());

            // Assert
            DeepAssert.Equal(result, customers);
        }
    }
}