using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Filter.Criteria;
using RiskControl.WinLossLimitControl.Filter.Model;
using RiskControl.WinLossLimitControl.Models;
using System.Collections.Generic;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Filter;

using Xunit.Asserts.Compare;

public class BaseEntityGroupLoaderServiceUnitTests
{
    [Fact]
    public void GetBaseEntityGroup_Always_ReturnsDataFromRepository()
    {
        // Arrange
        var baseEntityList = CreateBaseEntityList();
        var repository = Substitute.For<IDynamicRepository>();
        repository.Fetch<BaseEntity>(Arg.Compat.Any<GetAllCurrencyCriteria>()).Returns(baseEntityList);
        repository.Fetch<BaseEntity>(Arg.Compat.Any<GetAllGroupCriteria>()).Returns(baseEntityList);
        repository.Fetch<BaseEntity>(Arg.Compat.Any<GetAllProductCriteria>()).Returns(baseEntityList);
        repository.Fetch<BaseEntity>(Arg.Compat.Any<GetAllSiteCriteria>()).Returns(baseEntityList);

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

        DeepAssert.Equal(expected, baseEntityGroup);
    }

    private static List<BaseEntity> CreateBaseEntityList()
    {
        var baseEntity = new BaseEntity { Id = 1, Name = "Item 1" };
        return new List<BaseEntity>
        {
            baseEntity
        };
    }

    private static Dictionary<int, string> CreateExpectedDictionary()
    {
        return new Dictionary<int, string>
        {
            { 1, "Item 1" }
        };
    }
}