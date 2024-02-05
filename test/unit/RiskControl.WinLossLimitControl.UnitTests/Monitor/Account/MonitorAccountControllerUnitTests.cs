using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.AssociatedAcccount;
using RiskControl.WinLossLimitControl.Monitor.Account;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Account;

using Xunit.Asserts.Compare;

public class MonitorAccountControllerUnitTests
{
    [Fact]
    public async Task Post_Always_ReturnsResultFromMediator()
    {
        //// Arrange
        //var accountModel = new AccountModel
        //{
        //    UsersByDevice = new List<TopAssociatedAccount>(),
        //    UsersByIP = new List<TopAssociatedAccount>(),
        //    UsersByManual = new List<TopAssociatedAccount>(),
        //    Customer = new Customer()
        //};
        //var mediator = Substitute.For<IMediator>();
        //mediator.Send(Arg.Compat.Any<Request>()).Returns(accountModel);

        //// Act
        //var controller = new MonitorAccountController(mediator);
        //var actionResult = await controller.Post(new Request()) as OkObjectResult;
        //var jsonResult = actionResult.Value as AccountModel;

        //// Assert
        //DeepAssert.Equal(jsonResult, accountModel);
    }
}