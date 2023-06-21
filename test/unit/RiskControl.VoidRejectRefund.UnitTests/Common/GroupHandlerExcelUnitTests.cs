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
    public class GroupHandlerExcelUnitTests
    {
        private readonly Fixture fixture = new();

        private static ExcelPackage CreateExcelPackage()
        {
            var templateAbsolutelyPath = $"{AppDomain.CurrentDomain.BaseDirectory}/Templates/VoidRejectRefund/Company_Data.xlsx";
            using var stream = new FileStream(templateAbsolutelyPath, FileMode.Open, FileAccess.ReadWrite);
            return new ExcelPackage(stream, "");
        }

        [Fact]
        public async Task Handle_Successfully_ReturnsExpectedExcelFile()
        {
            // Arrange
            var statisticModel = fixture.Create<GroupStatisticReportModel>();

            var service = Substitute.For<GroupService>();
            service.Query(Arg.Compat.Any<HttpParameterGroupJson>()).Returns(statisticModel);

            var sortingService = Substitute.For<SortingService<GroupStatisticReportModel>>();
            sortingService.SortData(Arg.Compat.Any<GroupStatisticReportModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(statisticModel);

            var excelPackage = CreateExcelPackage();

            var excelBuilder = Substitute.For<GroupExcelBuilder>();
            excelBuilder.Build(Arg.Compat.Any<HttpParameterGroupExcel>(), Arg.Compat.Any<GroupStatisticExcelReportModel>()).Returns(excelPackage);

            var mapper = new MapperConfiguration(cf =>
            {
                cf.CreateMap<HttpParameterGroupExcel, HttpParameterGroupJson>();
                cf.CreateMap<GroupStatisticModel, GroupStatisticExcelModel>();
                cf.CreateMap<StatisticModel, CurrencyStatisticExcelModel>();
                cf.CreateMap<GroupStatisticReportModel, GroupStatisticExcelReportModel>();
                cf.CreateMap<ChildGroupStatisticModel, ChildGroupStatisticExcelModel>();
            }).CreateMapper();

            var handler = new GroupHandlerExcel(service, sortingService, excelBuilder, mapper);

            // Act
            var actualExcelPackage = await handler.Handle(new HttpParameterGroupExcel
            {
                SortDirection = "asc",
                SortColumnName = "BetCount"
            }, new CancellationToken());

            // Assert
            Assert.Equal("Company Void/Reject/Refund From 2022-10-01 To 2022-11-16 (Original currency)", actualExcelPackage.Workbook.Worksheets.First().Cells["A1"].Value.ToString());
            Assert.Equal("Company Void Reject Refund", actualExcelPackage.Workbook.Worksheets.First().Name);
        }
    }
}
