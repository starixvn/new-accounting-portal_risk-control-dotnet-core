using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.FailSafeSystem.Criteria;
using RiskControl.FailSafeSystem.Model;
using RiskControl.FailSafeSystem.Service;

namespace RiskControl.FailSafeSystem.UnitTests.Service;

public class FailSafeSystemServiceUnitTests
{
    private readonly IDynamicRepository repository;

    private readonly IMapper mapper;

    public FailSafeSystemServiceUnitTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        mapper = new MapperConfiguration(cf =>
        {
            cf.CreateMap<SettingRuleModel, SettingViewModel>();
        }).CreateMapper();
    }

    [Fact]
    public async Task GetRuleTitles_Always_ReturnExpectedList()
    {
        // Arrange
        repository.FetchAsync<RuleTitleModel>(Arg.Any<RuleTitleCriteria>()).Returns(DataHelper.GetRuleTitle);
        var service = new FailSafeSystemServiceImp(repository, mapper);

        // Act
        var actualResults = await service.GetRuleTitles();

        // Assert
        Assert.Equal(2, actualResults.Count());
    }

    [Fact]
    public async Task GetProducts_Always_ReturnExpectedList()
    {
        // Arrange
        repository.FetchAsync<ProductModel>(Arg.Any<ProductCriteria>()).Returns(DataHelper.GetProducts);
        var service = new FailSafeSystemServiceImp(repository, mapper);

        // Act
        var actualResults = await service.GetProducts();

        // Assert
        Assert.Equal(2, actualResults.Count());
    }

    [Fact]
    public async Task GetSettings_Always_ReturnExpectedList()
    {
        // Arrange
        repository.FetchMultipleAsync<SettingRuleModel, SettingCriteriaModel, SettingProductModel>(Arg.Any<SettingCriteria>())
            .Returns((DataHelper.GetSettingRules, DataHelper.GetSettingCriteria, DataHelper.GetSettingProducts));
        var service = new FailSafeSystemServiceImp(repository, mapper);

        // Act
        var actualResults = await service.GetSettings(new SettingCriteria());

        // Assert
        Assert.Equal(2, actualResults.Count());
        Assert.Equal("10", actualResults.First().GameIncome);
        Assert.Equal("1", actualResults.First().GamePayout);
        Assert.Equal("100", actualResults.ElementAt(1).GameIncome);
        Assert.Null(actualResults.ElementAt(1).GamePayout);
    }

    [Fact]
    public async Task AddRule_Always_AddSuccessfully()
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<AddRuleCriteria>()).Returns(1);
        var service = new FailSafeSystemServiceImp(repository, mapper);

        // Act
        var actualResult = await service.AddRule(new AddRuleCriteria());

        // Assert
        Assert.Equal(1, actualResult);
    }

    [Fact]
    public async Task EditRule_Always_EditSuccessfully()
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<EditRuleCriteria>()).Returns(1);
        var service = new FailSafeSystemServiceImp(repository, mapper);

        // Act
        var actualResult = await service.EditRule(new EditRuleCriteria());

        // Assert
        Assert.Equal(1, actualResult);
    }

    [Fact]
    public async Task DeleteRule_Always_DeleteRuleSuccessfully()
    {
        // Arrange
        repository.ExecuteAsync(Arg.Any<DeleteRuleCriteria>()).Returns(1);
        var service = new FailSafeSystemServiceImp(repository, mapper);

        // Act
        var actualResult = await service.DeleteRule(new DeleteRuleCriteria());

        // Assert
        Assert.Equal(1, actualResult);
    }

    [Fact]
    public async Task GetMonitors_Always_ReturnExpectedList()
    {
        // Arrange
        repository.FetchMultipleAsync<MonitorModel, MonitorCriteriaModel>(Arg.Any<MonitorCriteria>())
            .Returns((DataHelper.GetMonitors, DataHelper.GetMonitorCriteria));
        var service = new FailSafeSystemServiceImp(repository, mapper);

        // Act
        var actualResults = await service.GetMonitors(new MonitorCriteria());

        // Assert
        Assert.Equal(2, actualResults.Count());
        Assert.Equal("10 RM|1 %", actualResults.First().ReachedRule);
        Assert.Equal(string.Empty, actualResults.ElementAt(1).ReachedRule);
    }
}