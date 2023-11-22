using NSubstitute;
using RiskControl.ProgressiveJackpot.ApiModel;
using RiskControl.ProgressiveJackpot.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.ProgressiveJackpot.UnitTests;

using System;
using WebApiClient;
using Xunit.Asserts.Compare;

public class ProgressiveApiClientUnitTests
{
    [Fact]
    public async Task Post_ErrorCodeIsNonZero_ThrowsException()
    {
        // Arrange
        var resultDescription = new ResultDescription { ErrorCode = 1, ErrorDescription = "Unspecified Error" };
        var apiResult = new ApiResult<GameGroupResultContent> { Result = resultDescription };

        var richHttpClient = Substitute.For<RichHttpClient>();
        richHttpClient.PostJson<ApiResult<GameGroupResultContent>>(Arg.Compat.Any<string>(), Arg.Compat.Any<object>())
            .Returns(apiResult);

        var progresiveApiClient = new ProgressiveApiClientImp(richHttpClient);

        // Assert
        await Assert.ThrowsAsync<InvalidOperationException>(testCode);
        return;

        // Act
        async Task testCode() => await progresiveApiClient.PostJson<GameGroupResultContent>(string.Empty, string.Empty);
    }

    [Fact]
    public async Task Post_ErrorCodeIsZero_ReturnsListOfObject()
    {
        // Arrange
        var resultDescription = new ResultDescription { ErrorCode = 0 };
        var apiResult = new ApiResult<GameGroupResultContent>
        {
            Result = resultDescription,
            Content = new GameGroupResultContent { GameGroups = new List<GameGroupModel>() }
        };

        var richHttpClient = Substitute.For<RichHttpClient>();
        richHttpClient.PostJson<ApiResult<GameGroupResultContent>>(Arg.Compat.Any<string>(), Arg.Compat.Any<object>())
            .Returns(apiResult);

        var progresiveApiClient = new ProgressiveApiClientImp(richHttpClient);

        // Act
        var actualResults = await progresiveApiClient.PostJson<GameGroupResultContent>(string.Empty, string.Empty);

        // Assert
        DeepAssert.Equal(apiResult.Content.GameGroups, actualResults.GameGroups);
    }
}