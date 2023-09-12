using Fanex.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.Application.WareHouseStatus;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.Application.UnitTests.WareHouseStatus;

public class WareHouseStatusControllerUnitTests
{
    [Fact]
    public async Task Post_Always_ReturnTrue()
    {
        // Arrange
        var wareHouseDataRange = new WareHouseDataRange
        {
            Cube = "Cube",
            FirstDate = DateTime.Today,
            LastDate = DateTime.Today
        };
        var repository = Substitute.For<IDynamicRepository>();
        repository.FetchAsync<WareHouseDataRange>(Arg.Compat.Any<ICriteria>())
            .Returns(new List<WareHouseDataRange> { wareHouseDataRange });

        // Act
        var controller = new WareHouseStatusController(repository);
        var result = await controller.Post() as OkObjectResult;

        // Assert
        Assert.True((bool)result.Value);
    }
}