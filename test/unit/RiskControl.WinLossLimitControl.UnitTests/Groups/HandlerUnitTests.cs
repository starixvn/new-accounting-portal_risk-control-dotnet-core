using Fanex.Data.Repository;
using Newtonsoft.Json;
using NSubstitute;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Groups;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.Groups
{
    public class HandlerUnitTests
    {
        [Fact]
        public async Task Handle_Always_ReturnsProductGroupSettingList()
        {
            // Arrange
            var groupSetting = new GroupSetting
            {
                BetTypeId = 1,
                GroupId = 1,
                ProductId = 1
            };
            var fakeRawSettings = new List<GroupSetting> { groupSetting };
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchAsync<GroupSetting>(Arg.Compat.Any<ICriteria>()).Returns(fakeRawSettings);

            var cacheRefService = Substitute.For<CacheRefService>();
            cacheRefService.GetGroupName(Arg.Compat.Any<int>()).Returns("Group 1");
            cacheRefService.GetProductName(Arg.Compat.Any<int>()).Returns("Product 1");
            cacheRefService.GetBetTypeName(Arg.Compat.Any<int>()).Returns("BetType 1");
            cacheRefService.GetSportName(Arg.Compat.Any<int>()).Returns("Any Sport");

            // Act
            var readService = new Handler(repository, cacheRefService);
            var productGroupSettings = await readService.Handle(new Request(), new CancellationToken());

            // Assert
            const string ExpectedSettingJson = @"[
                {
                  ProductId: 1,
                  ProductName: 'Product 1',
                  Groups: [
                    {
                      GroupName: 'Group 1',
                      BetTypes: [
                        'BetType 1 (Any Sport)'
                      ]
                    }
                  ]
                }
            ]
            ";
            var expectedSettings = JsonConvert.DeserializeObject<List<ProductGroupSetting>>(ExpectedSettingJson);

            DeepAssert.Equal(productGroupSettings, expectedSettings);
        }
    }
}
