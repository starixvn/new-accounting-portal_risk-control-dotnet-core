using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http.Results;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Filter.Criteria;
using RiskControl.WinLossLimitControl.Filter.Model;
using RiskControl.WinLossLimitControl.Models;
using Microsoft.AspNetCore.Mvc;

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
            filterService.GetSiteByProduct(Arg.Any<GetSiteCriteria>()).Returns(siteGroups);

            // Act
            var controller = new FilterController(filterService);
            var actionResult = await controller.GetSiteLicensees(new GetSiteCriteria());
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, siteGroups);
        }

        [Fact]
        public async Task GetCurrencies_Always_ReturnsDataFromFilterService()
        {
            // Arrange
            var currencies = new List<BaseEntity> { new BaseEntity { Id = 1, Name = "A" } };
            var filterService = Substitute.For<FilterService>();
            filterService.GetCurrencies(Arg.Any<GetCurrencyCriteria>()).Returns(currencies);

            // Act
            var controller = new FilterController(filterService);
            var actionResult = await controller.GetCurrencies(new GetCurrencyCriteria());
            var jsonResult = actionResult as JsonResult;

            // Assert
            var expected = new List<BaseEntity> { new BaseEntity { Id = 1, Name = "A" } };
            DeepAssert.Equal(jsonResult.Value, expected);
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
            var actionResult = controller.GetProducts();
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, products);
        }

        [Fact]
        public async Task SearchUsers_Always_ReturnsDataFromFilterService()
        {
            // Arrange
            var customers = new List<Customer> { new Customer { CustId = 1, Username = "Any Username" } };
            var filterService = Substitute.For<FilterService>();
            filterService.SearchUsers(Arg.Any<CustomerSuggestionCriteria>()).Returns(customers);

            // Act
            var controller = new FilterController(filterService);
            var actionResult = await controller.SearchUsers(string.Empty);
            var jsonResult = actionResult as JsonResult;

            // Assert
            var expected = new List<string> { "Any Username" };
            DeepAssert.Equal(jsonResult.Value, expected);
        }
    }
}