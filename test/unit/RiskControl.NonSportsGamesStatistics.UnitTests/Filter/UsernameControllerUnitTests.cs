using AutoMapper;
using Fanex.Data.Repository;
using Fanex.NAP.Client.Helpers.Web;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Filter
{
    public class UsernameControllerUnitTests
    {
        private readonly IMapper mapper;
        public UsernameControllerUnitTests()
        {
            var mockMapper = new MapperConfiguration(mc =>
            {
                mc.CreateMap<UsernameValidationQueryModel, ValidUsernameCriteria>();
                mc.CreateMap<ValidationUsernameQueryModel, ValidationUsernameCriteria>();
            });
            mapper = mockMapper.CreateMapper();
        }

        [Fact]
        public async Task GetValidUserNames_Always_ReturnsFirstValueFromRepository()
        {
            // Arrange
            var fakeUsernames = new List<string>
            {
               "username 1",
               "username 2"
            };

            const string ExpectedUserName = "username 1";

            var session = Substitute.For<INapSession>();

            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<string>(Arg.Compat.Any<ValidUsernameCriteria>()).Returns(fakeUsernames);

            var controller = new UsernameController(session, repository, mapper);

            // Act
            var actualResult = await controller.GetValidUserNames(new UsernameValidationQueryModel { RoleId = 1, Username = "Any name" });

            // Assert
            DeepAssert.Equal(actualResult, ExpectedUserName);
        }

        [Fact]
        public async Task Suggest_Always_ReturnsDataFromRepository()
        {
            // Arrange
            var fakeUsernames = new List<string>
            {
               "username 1",
               "username 2"
            };

            var session = Substitute.For<INapSession>();
            session.UserId.Returns(1);

            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<string>(Arg.Compat.Any<UsernameSuggestionCriteria>()).Returns(fakeUsernames);

            var controller = new UsernameController(session, repository, mapper);

            // Act
            var actualResult = await controller.Suggest(new UsernameSuggestionQueryModel { RoleId = 1, UserName = "Any name", CustId = 1 });

            // Assert
            DeepAssert.Equal(actualResult, fakeUsernames);
        }

        [Fact]
        public async Task ValidateUsername_Always_ReturnsValidDataFromRepository()
        {
            // Arrange
            var fakeUsernames = new List<UsernameValidationModel>
            {
               new UsernameValidationModel {IsCust = true, CustId = "112" },
               new UsernameValidationModel {IsCust = false, CustId = "113" }

            };

            var expectedResult = new List<UsernameValidationModel> { new UsernameValidationModel { IsCust = true, CustId = "112" } };
            var session = Substitute.For<INapSession>();
            session.UserId.Returns(1);

            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<UsernameValidationModel>(Arg.Compat.Any<ValidationUsernameCriteria>()).Returns(fakeUsernames);

            var controller = new UsernameController(session, repository, mapper);

            // Act
            var actualResult = await controller.ValidateUsername(new ValidationUsernameQueryModel { Username = "username" });

            // Assert
            DeepAssert.Equal(actualResult, expectedResult);
        }
    }
}
