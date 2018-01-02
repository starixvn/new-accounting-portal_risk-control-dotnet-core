using System.Collections.Generic;
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
    public class BaseEntityGroupLoaderServiceUnitTests
    {
        [Fact]
        public void GetBaseEntityGroup_Always_ReturnsDataFromRepository()
        {
            // Arrange
            var baseEntityList = CreateBaseEntityList();
            var repository = Substitute.For<IDynamicRepository>();
            repository.Fetch<BaseEntity>(Arg.Any<GetAllCurrencyCriteria>()).Returns(baseEntityList);
            repository.Fetch<BaseEntity>(Arg.Any<GetAllGroupCriteria>()).Returns(baseEntityList);
            repository.Fetch<BaseEntity>(Arg.Any<GetAllProductCriteria>()).Returns(baseEntityList);
            repository.Fetch<BaseEntity>(Arg.Any<GetAllSiteCriteria>()).Returns(baseEntityList);

            // Act
            var service = new BaseEntityGroupLoaderServiceImp(repository);
            var baseEntityGroup = service.GetBaseEntityGroup();

            // Assert
            var expectedDictionary = CreateExpectedDictionary();
            var expected = new BaseEntityGroup
            {
                Currencies = expectedDictionary,
                Groups = expectedDictionary,
                Products = expectedDictionary,
                Sites = expectedDictionary
            };

            DeepAssert.Equal(baseEntityGroup, expected);
        }

        private List<BaseEntity> CreateBaseEntityList()
        {
            var baseEntity = new BaseEntity { Id = 1, Name = "Item 1" };
            return new List<BaseEntity>
            {
                baseEntity
            };
        }

        private Dictionary<int, string> CreateExpectedDictionary()
        {
            return new Dictionary<int, string>
            {
                { 1, "Item 1" }
            };
        }
    }
}