using System.Collections.Generic;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Newtonsoft.Json;
using NSubstitute;
using Xunit.Asserts.Compare;
using Xunit;
using RiskControl.WinLossLimitControl.Filter;
using RiskControl.WinLossLimitControl.Groups;
using System.Threading;

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
            var repository = Substitute.For<DynamicRepository>();
            repository.FetchAsync<GroupSetting>(Arg.Any<ICriteria>()).Returns(fakeRawSettings);

            var cacheRefService = Substitute.For<CacheRefService>();
            cacheRefService.GetGroupName(Arg.Any<int>()).Returns("Group 1");
            cacheRefService.GetProductName(Arg.Any<int>()).Returns("Product 1");
            cacheRefService.GetBetTypeName(Arg.Any<int>()).Returns("BetType 1");

            // Act
            var readService = new Handler(repository, cacheRefService);
            var productGroupSettings = await readService.Handle(new Request(),CancellationToken.None);

            // Assert
            const string ExpectedSettingJson = @"[
                {
                  ProductId: 1,
                  ProductName: 'Product 1',
                  Groups: [
                    {
                      GroupName: 'Group 1',
                      BetTypes: [
                        'BetType 1'
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