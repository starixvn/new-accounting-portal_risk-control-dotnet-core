using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Filter;

using Xunit.Asserts.Compare;

public class DeviceControllerUnitTests
{
    [Fact]
    public async Task Query_Device_ReturnDeviceItems()
    {
        // Arrange
        var expectedDevices = new List<DeviceModel>
        {
            new() { BetFrom = "Any bet from 1", FullName = "Any full name 1", GroupName = "Any group 1" },
            new() { BetFrom = "Any bet from 2", FullName = "Any full name 2", GroupName = "Any group 2" }
        };

        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<DeviceModel>(Arg.Compat.Any<DeviceCriteria>()).Returns(expectedDevices);

        var controller = new DeviceController(repository);

        // Act
        var result = await controller.Query();

        // Assert
        DeepAssert.Equal(result,expectedDevices);
    }
}