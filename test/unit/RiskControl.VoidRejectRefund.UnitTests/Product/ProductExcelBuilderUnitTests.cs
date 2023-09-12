using AutoFixture;
using NSubstitute;
using RiskControl.Core.Configuration;
using RiskControl.VoidRejectRefund.Common;
using RiskControl.VoidRejectRefund.Product;
using System;
using System.Linq;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Product;

public class ProductExcelBuilderUnitTests
{
    private readonly Fixture fixture = new();

    [Fact]
    public void Build_ProductModelHasData_ReturnsExpectedExcelFile()
    {
        // Arrange
        var configurationService = Substitute.For<ConfigurationService>();
        configurationService.CurrentDirectory.Returns(AppDomain.CurrentDomain.BaseDirectory);

        var reportModeService = Substitute.For<ReportModeService>();
        reportModeService.GetReportMode(Arg.Compat.Any<ReportType>()).Returns("Product");

        var httpParameterExcelBase = new HttpParameterExcelBase
        {
            Title = "Product Void/Reject/Refund From 2022-10-01 To 2022-11-17 (Original currency)",
            ReportBy = ReportType.Product
        };

        var model = fixture.Create<ProductModel>();

        var excelBuilder = new ProductExcelBuilderImp(configurationService, reportModeService);

        // Act
        var excelPackage = excelBuilder.Build(httpParameterExcelBase, model);

        // Assert
        Assert.Equal(httpParameterExcelBase.Title, excelPackage.Workbook.Worksheets.First().Cells["A1"].Value.ToString());
        Assert.Equal("Product Void Reject Refund", excelPackage.Workbook.Worksheets.First().Name);
    }
}