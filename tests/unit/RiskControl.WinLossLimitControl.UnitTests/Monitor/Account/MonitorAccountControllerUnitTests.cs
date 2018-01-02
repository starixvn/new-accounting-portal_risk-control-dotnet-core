using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http.Results;
using MediatR;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Monitor.Account;
using RiskControl.WinLossLimitControl.Monitor.Account.Model;
using Microsoft.AspNetCore.Mvc;

namespace RiskControl.WinLossLimitControl.UnitTests.Monitor.Account
{
    public class MonitorAccountControllerUnitTests
    {
        [Fact]
        public async Task Post_Always_ReturnsResultFromMediator()
        {
            // Arrange
            var accountModel = new AccountModel
            {
                UsersByDevice = new List<AssociatedUser>(),
                UsersByIP = new List<AssociatedUser>(),
                Customer = new Customer()
            };
            var mediator = Substitute.For<IMediator>();
            mediator.Send(Arg.Any<Request>()).Returns(accountModel);

            // Act
            var controller = new MonitorAccountController(mediator);
            var actionResult = await controller.Post(new Request());
            var jsonResult = actionResult as JsonResult;

            // Assert
            DeepAssert.Equal(jsonResult.Value, accountModel);
        }
    }
}