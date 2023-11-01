using NSubstitute;
using RiskControl.Configuration;
using RiskControl.WinLossLimitControl.FileDownload;
using System.IO;
using System.Runtime.CompilerServices;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.FileDownload;

public class FileContentServiceUnitTests
{
    private static string GetFakeFileServerDirectory([CallerFilePath] string sourceFilePath = "")
    {
        return $"{Path.GetDirectoryName(sourceFilePath)}";
    }

    [Fact]
    public void ReadAllBytes_ValidFile_ReturnBytes()
    {
        // Arrange
        var configurationService = Substitute.For<ConfigurationService>();
        var fileServerDirectory = GetFakeFileServerDirectory();
        configurationService.FileServerDirectory.Returns(fileServerDirectory);
        const string fileName = "AnyFile.xlsx";
        var service = new FileContentServiceImp(configurationService);

        // Act
        var actualResult = service.ReadAllBytes(fileName);

        // Assert
        Assert.NotNull(actualResult);
    }
}