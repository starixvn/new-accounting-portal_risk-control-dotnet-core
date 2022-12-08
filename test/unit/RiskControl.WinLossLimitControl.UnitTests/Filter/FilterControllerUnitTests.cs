using Microsoft.AspNetCore.Mvc;
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
    public class FilterControllerUnitTests
    {
        [Fact]
        public async Task GetSiteLicensees_Always_ReturnsDataFromFilterService()
        {
            // Arrange
            var siteGroups = new List<SiteGroup>();
            var filterService = Substitute.For<FilterService>();
            filterService.GetSiteByProduct(Arg.Compat.Any<GetSiteCriteria>()).Returns(siteGroups);

            // Act
            var controller = new FilterController(filterService);
            var data = await controller.GetSiteLicensees(new GetSiteCriteria()) as OkObjectResult;
            var actionResult = data.Value as IEnumerable<SiteGroup>;

            // Assert
            DeepAssert.Equal(siteGroups, actionResult);
        }

        [Fact]
        public async Task GetCurrencies_Always_ReturnsDataFromFilterService()
        {
            // Arrange
            var currencies = new List<BaseEntity>();
            var filterService = Substitute.For<FilterService>();
            filterService.GetCurrencies(Arg.Compat.Any<GetCurrencyCriteria>()).Returns(currencies);

            // Act
            var controller = new FilterController(filterService);
            var data = await controller.GetCurrencies(new GetCurrencyCriteria()) as OkObjectResult;
            var actionResult = data.Value as List<BaseEntity>;

            // Assert
            var expected = new List<BaseEntity>();
            DeepAssert.Equal(expected, actionResult);
        }

        [Fact]
        public void GetProducts_Always_ReturnsDataFromFilterService()
        {
            // Arrange
            var products = new List<BaseEntity>();
            var filterService = Substitute.For<FilterService>();
            filterService.GetProducts().Returns(products);

            // Act
            var controller = new FilterController(filterService);
            var data = controller.GetProducts() as OkObjectResult;
            var actionResult = data.Value as IEnumerable<BaseEntity>;

            // Assert
            DeepAssert.Equal(products, actionResult);
        }

        [Fact]
        public async Task SearchUsers_Always_ReturnsDataFromFilterService()
        {
            // Arrange
            var customer = new List<Customer> { new Customer { CustId = 1, Username = "Any Username" } };
            var filterService = Substitute.For<FilterService>();
            filterService.SearchUsers(Arg.Compat.Any<CustomerSuggestionCriteria>()).Returns(customer);

            // Act
            var controller = new FilterController(filterService);
            var data = await controller.SearchUsers(string.Empty) as OkObjectResult;
            var actionResult = data.Value as IEnumerable<string>;

            // Assert
            var expected = new List<string> { "Any Username" };
            DeepAssert.Equal(expected, actionResult.ToList());
        }

        [Fact]
        public async Task GetGroups_Always_ReturnsDataFromFilterService()
        {
            // Arrange
            var expectedGroupList = new List<Group> { new Group { GroupId = 50, GroupName = "AdvantPlay Mini" } };
            var filterService = Substitute.For<FilterService>();
            filterService.GetGroupByProduct(Arg.Compat.Any<GetGroupCriteria>()).Returns(expectedGroupList);

            // Act
            var controller = new FilterController(filterService);
            var data = await controller.GetGroups(new GetGroupCriteria()) as OkObjectResult;
            var actionResult = data.Value as List<Group>;

            // Assert
            DeepAssert.Equal(expectedGroupList, actionResult);
        }
    }
}
