using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.VoidRejectRefund.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Common;

using Xunit.Asserts.Compare;

public class GroupServiceUnitTests
{
    [Fact]
    public async Task Query_RepositoryReturnHasData_ReturnRightData()
    {
        // Arrange
        var fakeBodyData = TestDataProvider.Load<IEnumerable<StatisticEntity>>("fake-group-body-data");
        var fakeTotalData = TestDataProvider.Load<IEnumerable<StatisticEntity>>("fake-group-total-data");
        var expectedData = TestDataProvider.Load<GroupStatisticReportModel>("expected-group-data");

        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchMultipleAsync<StatisticEntity, StatisticEntity>(Arg.Compat.Any<Criteria>()).Returns((fakeBodyData, fakeTotalData));

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<HttpParameterJsonBase, Criteria>();
            cf.CreateMap<StatisticEntity, StatisticModel>();
        }).CreateMapper();

        var service = new GroupServiceImp(repository, mapper);

        // Act
        var actualResult = await service.Query(new HttpParameterJsonBase());

        // Assert
        DeepAssert.Equal(expectedData, actualResult);
    }
}