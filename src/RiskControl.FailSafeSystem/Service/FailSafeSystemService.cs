using AutoMapper;
using Fanex.Data.Repository;
using Fanex.NAP.Client;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RiskControl.FailSafeSystem.Constants;
using RiskControl.FailSafeSystem.Criteria;
using RiskControl.FailSafeSystem.Model;
using RiskControl.Services;
using RiskControl.WebApiClient;

namespace RiskControl.FailSafeSystem.Service;

public interface FailSafeSystemService
{
    Task<IEnumerable<RuleTitleModel>> GetRuleTitles();

    Task<IEnumerable<ProductModel>> GetProducts();

    Task<IEnumerable<SettingViewModel>> GetSettings(SettingCriteria criteria);

    Task<int> AddRule(AddRuleCriteria criteria);

    Task<int> EditRule(EditRuleCriteria criteria);

    Task<int> DeleteRule(DeleteRuleCriteria criteria);

    Task<IEnumerable<MonitorModel>> GetMonitors(MonitorCriteria criteria);

    Task<IEnumerable<ManageProductStatusModel>> GetManageProductStatus(ManageProductStatusCriteria criteria);

    Task<IEnumerable<ProductStatusHistoryModel>> GetProductStatusHistory(ProductStatusHistoryCriteria criteria);

    Task<ApiResultModel> EnableSport(EnableSportCriteria criteria);
}

public class FailSafeSystemServiceImp(IDynamicRepository repository,
    IMapper mapper,
    INapSession napSession,
    LogDataService logData,
    RichHttpClient richHttpClient,
    IConfiguration configuration) : FailSafeSystemService
{
    private readonly ApiResultModel DefaultApiResult = new()
    {
        ErrorCode = 0,
        ErrorDescription = "Success"
    };

    public Task<IEnumerable<RuleTitleModel>> GetRuleTitles()
    {
        return repository.FetchAsync<RuleTitleModel>(new RuleTitleCriteria());
    }

    public Task<IEnumerable<ProductModel>> GetProducts()
    {
        return repository.FetchAsync<ProductModel>(new ProductCriteria());
    }

    public async Task<IEnumerable<SettingViewModel>> GetSettings(SettingCriteria criteria)
    {
        var rawData = await repository.FetchMultipleAsync<SettingRuleModel, SettingCriteriaModel, SettingProductModel>(criteria);
        var data = mapper.Map<IEnumerable<SettingViewModel>>(rawData.Item1).ToList();
        data.ForEach(item =>
        {
            item.GameIncome = rawData.Item2.FirstOrDefault(r => r.ConstantKey == item.ConstantKey && r.CriteriaId == CriteriaTypeConstants.GameIncome)?.CriteriaValue;
            item.GamePayout = rawData.Item2.FirstOrDefault(r => r.ConstantKey == item.ConstantKey && r.CriteriaId == CriteriaTypeConstants.GamePayout)?.CriteriaValue;
            item.ProductList = rawData.Item3.Where(p => p.ConstantKey == item.ConstantKey).Select(s => s.ProductName).ToArray();
        });
        return data;
    }

    public Task<int> AddRule(AddRuleCriteria criteria)
    {
        criteria.CreatedBy = napSession.UserId;
        return repository.ExecuteAsync(criteria);
    }

    public Task<int> EditRule(EditRuleCriteria criteria)
    {
        criteria.CreatedBy = napSession.UserId;
        return repository.ExecuteAsync(criteria);
    }

    public Task<int> DeleteRule(DeleteRuleCriteria criteria)
    {
        criteria.CreatedBy = napSession.UserId;
        return repository.ExecuteAsync(criteria);
    }

    public async Task<IEnumerable<MonitorModel>> GetMonitors(MonitorCriteria criteria)
    {
        var rawData = await repository.FetchMultipleAsync<MonitorModel, MonitorCriteriaModel>(criteria);
        var data = rawData.Item1.ToList();
        data.ForEach(item =>
        {
            item.ReachedRule = GetReachedRule(rawData.Item2, item.RuleId);
        });
        return data;
    }

    public async Task<IEnumerable<ManageProductStatusModel>> GetManageProductStatus(ManageProductStatusCriteria criteria)
    {
        var result = await repository.FetchAsync<ManageProductStatusModel>(criteria);
        result.ToList().ForEach(item =>
        {
            var apiResult = SafeDeserialize(item.LastAPIResponseMessage, DefaultApiResult);
            item.Status = GetStatus(apiResult, item.LastActionType);
        });
        return result.OrderBy(o => o.Status)
            .ThenByDescending(o => o.LastUpdated)
            .ThenBy(o => o.ProductId)
            .ThenBy(o => o.SportType);
    }

    public async Task<IEnumerable<ProductStatusHistoryModel>> GetProductStatusHistory(ProductStatusHistoryCriteria criteria)
    {
        var data = await repository.FetchAsync<ProductStatusHistoryModel>(criteria);
        data.ToList().ForEach(item =>
        {
            var apiResult = SafeDeserialize(item.ApiResponseMessage, DefaultApiResult);
            item.Description = apiResult.ErrorDescription;
            item.ActionType = $"{item.ActionType}d";
            item.IsSuccess = item.ActionType == "Enabled" ?
                apiResult is { ErrorCode: 0 or 1011 } : apiResult is { ErrorCode: 0 };
        });
        return data;
    }

    public async Task<ApiResultModel> EnableSport(EnableSportCriteria criteria)
    {
        var request = new UmSportRequest
        {
            SportTypeId = criteria.SportType,
            Seq = criteria.SportType.ToString()
        };
        var options = new Dictionary<string, string>
        {
            { "Authentication", configuration.GetSection("UmSportApiKey").Value ?? string.Empty }
        };
        var result = await richHttpClient.PostJsonWithOption<ApiResultModel>(configuration.GetSection("UmSportApi").Value, request,
            options);
        var logCommand = new InsertProductActionLogCommand
        {
            ApiResponseMessage = JsonConvert.SerializeObject(result),
            InsertTime = DateTime.Now,
            ApiJsonBodyInfo = JsonConvert.SerializeObject(request),
            ApiResponseStatusCode = result.StatusCode,
            SportType = criteria.SportType,
            ProductId = criteria.ProductId,
            CreatedBy = napSession.UserId,
            ActionType = result is { ErrorCode: 0 or 1011 } ? "Enable" : "Disable"
        };
        await repository.ExecuteAsync(logCommand);
        return result;
    }

    private static string GetStatus(ApiResultModel model, string actionType)
    {
        if (actionType == "Enable")
        {
            return model is { ErrorCode: 0 or 1011 } ? "Enabled" : "Disabled";
        }

        return model is { ErrorCode: 0 } ? "Disabled" : "Enabled";
    }

    private static string GetReachedRule(IEnumerable<MonitorCriteriaModel> criterias, int ruleId)
    {
        var data = criterias.Where(r => r.RuleId == ruleId)
            .Select(s => $"{s.CriteriaValue} {s.PostFix}");
        return !data.Any() ? string.Empty : string.Join('|', data);
    }

    public static T SafeDeserialize<T>(string json, T defaultValue = default)
    {
        try
        {
            return JsonConvert.DeserializeObject<T>(json);
        }
        catch (JsonException)
        {
            return defaultValue;
        }
    }
}