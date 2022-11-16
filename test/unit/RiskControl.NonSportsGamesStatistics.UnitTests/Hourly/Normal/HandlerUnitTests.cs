using AutoMapper;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Hourly;
using RiskControl.NonSportsGamesStatistics.Hourly.Normal;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.UnitTest.Core.TestUtilities;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Hourly.Normal
{
    public class HandlerUnitTests
    {
        [Fact]
        public async Task Handle_NormalModeWithAnyQueryModel_ReturnRightStatistics()
        {
            // Arrange
            var fakeHourlyReportModel = TestDataProvider.Load<HourlyReportModel>("fake-service-data");
            var expectedHourlyReportModel = TestDataProvider.Load<HourlyReportModel>("expected-report-statistics");

            var service = Substitute.For<Service>();
            service.CalculateHourlyReport(Arg.Compat.Any<Criteria>(), Arg.Compat.Any<DateTime>()).Returns(fakeHourlyReportModel);

            var mapper = new MapperConfiguration(cf =>
            {
                cf.CreateMap<QueryModel, Criteria>();
            }).CreateMapper();

            var handler = new Handler(service, mapper);

            // Act
            var actualResult = await handler.Handle(
                new QueryModel
                {
                    WinLostDate = new DateTime(2017, 1, 1),
                    UsernameDrillDown = true
                },
                new CancellationToken());

            // Assert
            DeepAssert.Equal(expectedHourlyReportModel, actualResult);
        }
    }
}
