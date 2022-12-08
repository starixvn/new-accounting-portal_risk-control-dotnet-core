using AutoFixture;
using AutoMapper;
using NSubstitute;
using OfficeOpenXml;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Product;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Product
{
    public class ProductExcelHandlerUnitTests
    {
        private readonly Fixture fixture = new Fixture();

        private static ExcelPackage CreateExcelPackage()
        {
            var templateAbsolutelyPath = $"{AppDomain.CurrentDomain.BaseDirectory}/Templates/VoidRejectRefund/Product_Data.xlsx";
            using var stream = new FileStream(templateAbsolutelyPath, FileMode.Open, FileAccess.ReadWrite);
            return new ExcelPackage(stream, "");
        }

        [Fact]
        public async Task Handle_Successfully_ReturnsExpectedExcelFile()
        {
            // Arrange
            var statisticModel = fixture.Create<ProductModel>();

            var service = Substitute.For<ProductService>();
            service.Query(Arg.Compat.Any<HttpParameterGroupJson>()).Returns(statisticModel);

            var sortingService = Substitute.For<SortingService<ProductModel>>();
            sortingService.SortData(Arg.Compat.Any<ProductModel>(), Arg.Compat.Any<string>(), Arg.Compat.Any<string>()).Returns(statisticModel);

            var excelPackage = CreateExcelPackage();

            var excelBuilder = Substitute.For<ProductExcelBuilder>();
            excelBuilder.Build(Arg.Compat.Any<VoidRejectRefund.Product.HttpParameterExcel>(), Arg.Compat.Any<ProductModel>()).Returns(excelPackage);

            var mapper = new MapperConfiguration(cf =>
            {
                cf.CreateMap<VoidRejectRefund.Product.HttpParameterExcel, HttpParameterGroupJson>();
            }).CreateMapper();

            var handler = new ProductExcelHandler(service, sortingService, excelBuilder, mapper);

            // Act
            var actualExcelPackage = await handler.Handle(new VoidRejectRefund.Product.HttpParameterExcel()
            {
                SortDirection = "asc",
                SortColumnName = "BetCount"
            }, new CancellationToken());

            // Assert
            Assert.Equal("Product Void/Reject/Refund From 2022-10-01 To 2022-11-17 (Original currency)", actualExcelPackage.Workbook.Worksheets.First().Cells["A1"].Value.ToString());
            Assert.Equal("Product Void Reject Refund", actualExcelPackage.Workbook.Worksheets.First().Name);
        }
    }
}
