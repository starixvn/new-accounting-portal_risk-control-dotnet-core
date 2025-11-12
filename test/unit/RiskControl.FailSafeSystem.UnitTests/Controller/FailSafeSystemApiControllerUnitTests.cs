using Fanex.NAP.Client.Helpers.Business;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.FailSafeSystem.Controller;
using RiskControl.FailSafeSystem.Criteria;
using RiskControl.FailSafeSystem.Service;
using RiskControl.Model;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.FailSafeSystem.UnitTests.Controller;

public class FailSafeSystemApiControllerUnitTests
{
    private readonly FailSafeSystemService service = Substitute.For<FailSafeSystemService>();

    private readonly AuthorizationService authorizationService = Substitute.For<AuthorizationService>();

    [Fact]
    public async Task GetRuleTitles_Always_CallRightFunctionFromFailSafeSystemService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        await controller.GetRuleTitles();

        // Assert
        await service.Received().GetRuleTitles();
    }

    [Fact]
    public async Task GetProducts_Always_CallRightFunctionFromFailSafeSystemService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        await controller.GetProducts();

        // Assert
        await service.Received().GetProducts();
    }

    [Fact]
    public async Task GetSettings_Always_CallRightFunctionFromFailSafeSystemService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        await controller.GetSettings(new SettingCriteria());

        // Assert
        await service.Received().GetSettings(Arg.Compat.Any<SettingCriteria>());
    }

    [Fact]
    public async Task AddRule_Always_CallRightFunctionFromFailSafeSystemService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        await controller.AddRule(new AddRuleCriteria());

        // Assert
        await service.Received().AddRule(Arg.Compat.Any<AddRuleCriteria>());
    }

    [Fact]
    public async Task EditRule_Always_CallRightFunctionFromFailSafeSystemService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        await controller.EditRule(new EditRuleCriteria());

        // Assert
        await service.Received().EditRule(Arg.Compat.Any<EditRuleCriteria>());
    }

    [Fact]
    public async Task DeleteRule_Always_CallRightFunctionFromFailSafeSystemService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        await controller.DeleteRule(new DeleteRuleCriteria());

        // Assert
        await service.Received().DeleteRule(Arg.Compat.Any<DeleteRuleCriteria>());
    }

    [Fact]
    public async Task GetMonitor_Always_CallRightFunctionFromFailSafeSystemService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        await controller.GetMonitor(new MonitorCriteria());

        // Assert
        await service.Received().GetMonitors(Arg.Compat.Any<MonitorCriteria>());
    }

    [Fact]
    public async Task GetManageProductStatus_Always_CallRightFunctionFromFailSafeSystemService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        await controller.GetManageProductStatus(new ManageProductStatusCriteria());

        // Assert
        await service.Received().GetManageProductStatus(Arg.Compat.Any<ManageProductStatusCriteria>());
    }

    [Fact]
    public async Task GetProductStatusHistory_Always_CallRightFunctionFromFailSafeSystemService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        await controller.GetProductStatusHistory(new ProductStatusHistoryCriteria());

        // Assert
        await service.Received().GetProductStatusHistory(Arg.Compat.Any<ProductStatusHistoryCriteria>());
    }

    [Fact]
    public async Task EnableSport_Always_CallRightFunction()
    {
        // Arrange  
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act  
        var expectedData = controller.EnableSport(new EnableSportCriteria());

        // Assert  
        await service.Received().EnableSport(Arg.Compat.Any<EnableSportCriteria>());
    }

    [Fact]
    public async Task EnableSports_Always_CallRightFunction()
    {
        // Arrange  
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act  
        var expectedData = controller.EnableSports(new EnableSportsCriteria());

        // Assert  
        await service.Received().EnableSports(Arg.Compat.Any<EnableSportsCriteria>());
    }

    [Fact]
    public void HasPermission_Always_CallRightFunctionFromAuthorizationService()
    {
        // Arrange
        var controller = new FailSafeSystemApiController(service, authorizationService);

        // Act
        controller.HasHostPermission();

        // Assert
        authorizationService.Received().HasPermission(FunctionKeys.FailSafeSystemSetting, Constant.Policy.Host);
    }
}