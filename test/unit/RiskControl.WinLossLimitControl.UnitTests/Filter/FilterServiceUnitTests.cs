using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Filter.Criteria;
using RiskControl.WinLossLimitControl.Filter.Model;
using RiskControl.WinLossLimitControl.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

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
            repository.FetchAsync<BaseEntity>(Arg.Compat.Any<ICriteria>()).Returns(currencies);

            var cacheRefService = Substitute.For<CacheRefService>();

            // Act
            var service = new FilterServiceImp(repository, cacheRefService);
            var actualResult = await service.GetCurrencies(new GetCurrencyCriteria());

            // Assert
            DeepAssert.Equal(currencies, actualResult);
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
            var actualResult = service.GetProducts().ToList();

            // Assert
            var expected = new List<BaseEntity> { new() { Id = 1, Name = "Product 1" } };
            DeepAssert.Equal(expected, actualResult);
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
            repository.FetchAsync<Site>(Arg.Compat.Any<ICriteria>()).Returns(sites);

            var cacheRefService = Substitute.For<CacheRefService>();

            // Act
            var service = new FilterServiceImp(repository, cacheRefService);
            var actualResult = await service.GetSiteByProduct(new GetSiteCriteria());

            // Assert
            var siteGroup = new SiteGroup
            {
                GroupName = "Group 1",
                Sites = sites
            };
            var expected = new List<SiteGroup> { siteGroup };

            DeepAssert.Equal(expected, actualResult.ToList());
        }

        [Fact]
        public async Task SearchUsers_Always_ReturnDataFromRepository()
        {
            // Arrange
            var customer = new Customer { CustId = 1, Username = "Username 1" };
            var customers = new List<Customer> { customer };
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<Customer>(Arg.Compat.Any<ICriteria>()).Returns(customers);

            var cacheRefService = Substitute.For<CacheRefService>();

            // Act
            var service = new FilterServiceImp(repository, cacheRefService);
            var actualResult = await service.SearchUsers(new CustomerSuggestionCriteria());

            // Assert
            DeepAssert.Equal(customers, actualResult);
        }

        [Fact]
        public async Task GetGroups_Always_ReturnDataFromRepository()
        {
            // Arrange
            var expectedGroupList = new List<Group> { new() { GroupId = 50, GroupName = "AdvantPlay Mini" } };
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<Group>(Arg.Compat.Any<ICriteria>()).Returns(expectedGroupList);

            var cacheRefService = Substitute.For<CacheRefService>();

            // Act
            var service = new FilterServiceImp(repository, cacheRefService);
            var actualResult = await service.GetGroupByProduct(new GetGroupCriteria());

            // Assert
            DeepAssert.Equal(expectedGroupList, actualResult);
        }
    }
}
