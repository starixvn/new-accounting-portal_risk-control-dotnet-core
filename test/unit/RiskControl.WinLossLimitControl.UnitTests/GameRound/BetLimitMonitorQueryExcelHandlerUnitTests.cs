using AutoMapper;
using NSubstitute;
using RiskControl.Core.Configuration;
using RiskControl.WinLossLimitControl.GameRound;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Model;
using RiskControl.WinLossLimitControl.GameRound.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.GameRound
{
    public class BetLimitMonitorQueryExcelHandlerUnitTests
    {
        [Fact]
        public async Task Handle_Always_ReturnsCorrectExcelContent()
        {
            // Arrange
            var betLimitMonitorDataService = Substitute.For<BetLimitMonitorDataService>();
            betLimitMonitorDataService.Query(Arg.Compat.Any<BetLimitMonitorQueryCriteria>()).Returns(BetLimitMonitors);

            var configurationService = Substitute.For<ConfigurationService>();
            configurationService.CurrentDirectory.Returns($"{AppDomain.CurrentDomain.BaseDirectory}");

            var mapper = new MapperConfiguration(mcf =>
            {
                mcf.CreateMap<BetLimitMonitorQueryExcelRequest, BetLimitMonitorQueryCriteria>();
            }).CreateMapper();

            var handler = new BetLimitMonitorQueryExcelHandler(betLimitMonitorDataService, configurationService, mapper);

            // Act
            var excelPackage = await handler.Handle(new BetLimitMonitorQueryExcelRequest(), new CancellationToken());

            // Assert
            var cells = excelPackage.Workbook.Worksheets.First().Cells;
            Assert.Equal("1", cells["A5"].Value.ToString());
            Assert.Equal("Product 1", cells["B5"].Value.ToString());
            Assert.Equal("Bet Type 1", cells["C5"].Value.ToString());
            Assert.Equal("Game Ground 1", cells["D5"].Value.ToString());
            Assert.Equal("10000", cells["E5"].Value.ToString());
            Assert.Equal("3", cells["F5"].Value.ToString());
            Assert.Equal("2", cells["G5"].Value.ToString());
            Assert.Equal("1000", cells["H5"].Value.ToString());
        }

        private static List<BetLimitMonitorModel> BetLimitMonitors
        {
            get
            {
                var settings = new List<BetLimitMonitorModel>();
                var setting1 = new BetLimitMonitorModel
                {
                    Index = 1,
                    BetType = 1,
                    BetTypeName = "Bet Type 1",
                    ProductId = 1,
                    ProductName = "Product 1",
                    SportType = 1,
                    BetCount = 3,
                    NoOfPlayers = 2,
                    GameRound = "Game Ground 1",
                    GameRoundBetLimit = 10000,
                    TotalStake = 1000,
                    ReachedLimitTime = new DateTime(2000, 1, 1)
                };
                settings.Add(setting1);

                return settings;
            }
        }
    }
}
