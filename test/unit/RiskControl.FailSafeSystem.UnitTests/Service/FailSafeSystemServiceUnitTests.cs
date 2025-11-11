using AutoMapper;
using Fanex.Data.Repository;
using Fanex.NAP.Client;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using RiskControl.FailSafeSystem.Criteria;
using RiskControl.FailSafeSystem.Model;
using RiskControl.FailSafeSystem.Service;
using RiskControl.Services;
using RiskControl.WebApiClient;

namespace RiskControl.FailSafeSystem.UnitTests.Service;

public class FailSafeSystemServiceUnitTests
{
    private readonly IDynamicRepository repository;

    private readonly IMapper mapper;

    private readonly INapSession napSession;

    private readonly LogDataService logDataService;

    private readonly IConfiguration configuration;

    private readonly RichHttpClient richHttpClient;

    public FailSafeSystemServiceUnitTests()
    {
        repository = Substitute.For<IDynamicRepository>();
        napSession = Substitute.For<INapSession>();
        logDataService = Substitute.For<LogDataService>();
        configuration = Substitute.For<IConfiguration>();
        richHttpClient = Substitute.For<RichHttpClient>();
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
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);

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
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);

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
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);
        

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
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);

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
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);

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
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);

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
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);

        // Act
        var actualResults = await service.GetMonitors(new MonitorCriteria());

        // Assert
        Assert.Equal(2, actualResults.Count());
        Assert.Equal("10 RM|1 %", actualResults.First().ReachedRule);
        Assert.Equal(string.Empty, actualResults.ElementAt(1).ReachedRule);
    }

    [Fact]
    public async Task GetManageProductStatus_Always_ReturnExpectedList()
    {
        // Arrange
        repository.FetchAsync<ManageProductStatusModel>(Arg.Any<ManageProductStatusCriteria>())
            .Returns((DataHelper.GetManageProductStatus));
        richHttpClient.PostJsonWithOption<ApiResultModel>(Arg.Any<string>(), Arg.Any<object>(), Arg.Any<Dictionary<string, string>>())
            .Returns((DataHelper.GetApiResultModel));
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);

        // Act
        var actualResults = await service.GetManageProductStatus(new ManageProductStatusCriteria());

        // Assert
        Assert.Equal(3, actualResults.Count());
        Assert.Equal(1, actualResults.First().Items.Count());
        Assert.Equal(3, actualResults.ElementAt(1).ProductId);
    }

    [Fact]
    public async Task GetProductStatusHistory_Always_ReturnExpectedList()
    {
        // Arrange
        repository.FetchAsync<ProductStatusHistoryModel>(Arg.Any<ProductStatusHistoryCriteria>())
            .Returns((DataHelper.GetProductStatusHistory));
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);

        // Act
        var actualResults = await service.GetProductStatusHistory(new ProductStatusHistoryCriteria());

        // Assert
        Assert.Equal(2, actualResults.Count());
        Assert.Equal("Disabled", actualResults.First().ActionType);
        Assert.Equal("starix1", actualResults.ElementAt(1).ProceededBy);
    }

    [Fact]
    public async Task EnableSport_Always_ReturnExpectedList()
    {
        // Arrange
        richHttpClient.PostJsonWithOption<ApiResultModel>(Arg.Any<string>(), Arg.Any<object>(), Arg.Any<Dictionary<string,string>>())
            .Returns((DataHelper.GetApiResultModel));
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);
        repository.ExecuteAsync(Arg.Any<InsertProductActionLogCommand>()).Returns(1);

        // Act
        var actualResult = await service.EnableSport(new EnableSportCriteria());

        // Assert
        Assert.Equal("Success", actualResult.ErrorDescription);
        Assert.Equal(200, actualResult.StatusCode);
    }

    [Fact]
    public async Task EnableSports_Always_ReturnExpectedList()
    {
        // Arrange
        richHttpClient.PostJsonWithOption<ApiResultModel>(Arg.Any<string>(), Arg.Any<object>(), Arg.Any<Dictionary<string, string>>())
            .Returns((DataHelper.GetApiResultModel));
        var service = new FailSafeSystemServiceImp(repository, mapper, napSession, logDataService, richHttpClient, configuration);
        repository.ExecuteAsync(Arg.Any<InsertProductActionLogCommand>()).Returns(1);

        // Act
        var actualResult = await service.EnableSports(new EnableSportsCriteria { SportTypes = [161] });

        // Assert
        Assert.Equal("Success", actualResult.First().ErrorDescription);
        Assert.Equal(200, actualResult.First().StatusCode);
    }
}