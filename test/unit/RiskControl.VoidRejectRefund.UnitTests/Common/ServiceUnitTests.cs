using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.VoidRejectRefund.Common;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Common;

public class ServiceUnitTests
{
    [Fact]
    public async Task Query_RepositoryReturnHasData_ReturnRightData()
    {
        // Arrange
        var fakeBodyData = TestDataProvider.Load<IEnumerable<StatisticEntity>>("fake-body-data");
        var fakeGrandTotalData = TestDataProvider.Load<IEnumerable<StatisticEntity>>("fake-grand-total-data");
        var expectedData = TestDataProvider.Load<StatisticReportModel>("expected-data");

        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchMultipleAsync<StatisticEntity, StatisticEntity>(Arg.Compat.Any<Criteria>()).Returns((fakeBodyData, fakeGrandTotalData));

        var mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<HttpParameterJsonBase, Criteria>();
            cf.CreateMap<StatisticEntity, StatisticModel>();
        }).CreateMapper();

        var service = new ServiceImp(repository, mapper);

        // Act
        var actualResult = await service.Query(new HttpParameterJsonBase());

        // Assert
        DeepAssert.Equal(expectedData, actualResult);
    }
}