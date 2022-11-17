using AutoFixture;
using AutoMapper;
using NSubstitute;
using OfficeOpenXml;
using RiskControl.VoidRejectRefund.Common;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Common
{
    public class HandlerExcelUnitTests
    {
        private readonly Fixture fixture = new Fixture();

        private static ExcelPackage CreateExcelPackage()
        {
            var templateAbsolutelyPath = $"{AppDomain.CurrentDomain.BaseDirectory}/Templates/VoidRejectRefund/Daily_Data.xlsx";
            using var stream = new FileStream(templateAbsolutelyPath, FileMode.Open, FileAccess.ReadWrite);
            return new ExcelPackage(stream, "");
        }

        [Fact]
        public async Task Handle_Successfully_ReturnsExpectedExcelFile()
        {
            // Arrange
            var statisticModel = fixture.Create<StatisticReportModel>();

            var service = Substitute.For<Service>();
            service.Query(Arg.Compat.Any<HttpParameterJson>()).Returns(statisticModel);

            var sortingService = Substitute.For<SortingService<StatisticReportModel>>();
            sortingService.SortData(Arg.Compat.Any<StatisticReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(statisticModel);

            var excelPackage = CreateExcelPackage();

            var excelBuilder = Substitute.For<ExcelBuilder>();
            excelBuilder.Build(Arg.Compat.Any<HttpParameterExcel>(), Arg.Compat.Any<StatisticExcelReportModel>()).Returns(excelPackage);

            var mapper = new MapperConfiguration(cf =>
            {
                cf.CreateMap<HttpParameterExcel, HttpParameterJson>();
                cf.CreateMap<StatisticModel, StatisticExcelModel>();
                cf.CreateMap<StatisticModel, CurrencyStatisticExcelModel>();
                cf.CreateMap<StatisticReportModel, StatisticExcelReportModel>();
            }).CreateMapper();

            var handler = new HandlerExcel(service, sortingService, excelBuilder, mapper);

            // Act
            var actualExcelPackage = await handler.Handle(new HttpParameterExcel()
            {
                SortDirection = "asc",
                SortColumnName = "BetCount"
            }, new CancellationToken());

            // Assert
            Assert.Equal("Daily Void/Reject/Refund From 2022-10-01 To 2022-11-16 (Original currency)", actualExcelPackage.Workbook.Worksheets.First().Cells["A1"].Value.ToString());
            Assert.Equal("Daily Void Reject Refund", actualExcelPackage.Workbook.Worksheets.First().Name);
        }
    }
}
