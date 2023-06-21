using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using RiskControl.WinLossLimitControl.FileDownload;
using System.IO;
using Xunit;

namespace RiskControl.WinLossLimitControl.UnitTests.FileDownload
{
    public class FileDownloadControllerUnitTests
    {
        [Fact]
        public void Index_ValidBase64String_ReturnsRightFileName()
        {
            // Arrange
            const string Base64String = "UmVwb3J0Lnhsc3g=";
            var fileContentService = Substitute.For<FileContentService>();
            var controller = new FileDownloadController(fileContentService);

            // Act
            var view = (ViewResult)controller.Index(Base64String);
            var viewModel = view.Model as FileDownloadModel;

            // Assert
            Assert.Equal("Report.xlsx", viewModel.FileName);
        }

        [Fact]
        public void Excel_ValidFile_ReturnsThatFileContent()
        {
            // Arrange
            var sampleByteArray = new byte[] { 1, 2 };
            const string TempFile = "AnyFile.xlsx";
            var fileContentService = Substitute.For<FileContentService>();
            fileContentService.ReadAllBytes(TempFile).Returns(sampleByteArray);
            var controller = new FileDownloadController(fileContentService);

            // Act
            var view = (FileContentResult)controller.Excel(TempFile);
            var viewModel = view.FileContents;

            // Assert
            Assert.Equal(sampleByteArray, viewModel);
        }

        [Fact]
        public void Excel_InvalidFile_ReturnsNotFoundView()
        {
            // Arrange
            const string TempFile = "AnyFile.xlsx";
            var fileContentService = Substitute.For<FileContentService>();
            fileContentService.ReadAllBytes(TempFile).Returns(_ => throw new FileNotFoundException());
            var controller = new FileDownloadController(fileContentService);

            // Act
            var view = (ViewResult)controller.Excel(TempFile);
            var viewName = view.ViewName;

            // Assert
            Assert.Equal("NotFound", viewName);
        }
    }
}
