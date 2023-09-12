using RiskControl.VoidRejectRefund.Common;
using Xunit;

namespace RiskControl.VoidRejectRefund.UnitTests.Common;

public class ReportModeServiceUnitTests
{
    [Theory]
    [InlineData(ReportType.None, "")]
    [InlineData(ReportType.Daily, "Daily")]
    [InlineData(ReportType.Monthly, "Monthly")]
    [InlineData(ReportType.Product, "Product")]
    [InlineData(ReportType.Company, "Company")]
    [InlineData(ReportType.Currency, "Currency")]
    [InlineData(ReportType.Device, "Device")]
    public void GetReportMode_Always_ReturnRightMode(ReportType reportType, string expected)
    {
        // Arrange
        var service = new ReportModeServiceImp();

        // Act
        var actualResult =  service.GetReportMode(reportType);

        // Assert
        Assert.Equal(expected, actualResult);
    }
}