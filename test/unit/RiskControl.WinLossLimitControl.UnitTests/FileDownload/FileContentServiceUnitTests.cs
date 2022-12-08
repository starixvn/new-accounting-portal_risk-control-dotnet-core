using NSubstitute;
using RiskControl.Core.Configuration;
using RiskControl.WinLossLimitControl.FileDownload;
using System.IO;
using System.Runtime.CompilerServices;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.FileDownload
{
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
            string fileServerDirectory = GetFakeFileServerDirectory();
            configurationService.FileServerDirectory.Returns(fileServerDirectory);
            string fileName = "AnyFile.xlsx";
            var service = new FileContentServiceImp(configurationService);

            // Act
            var actualResult = service.ReadAllBytes(fileName);

            // Assert
            Assert.NotNull(actualResult);
        }
    }
}
