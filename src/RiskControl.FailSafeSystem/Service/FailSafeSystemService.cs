using AutoMapper;
using Fanex.Data.Repository;
using RiskControl.FailSafeSystem.Constants;
using RiskControl.FailSafeSystem.Criteria;
using RiskControl.FailSafeSystem.Model;

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
}

public class FailSafeSystemServiceImp(IDynamicRepository repository, IMapper mapper) : FailSafeSystemService
{
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
        return repository.ExecuteAsync(criteria);
    }

    public Task<int> EditRule(EditRuleCriteria criteria)
    {
        return repository.ExecuteAsync(criteria);
    }

    public Task<int> DeleteRule(DeleteRuleCriteria criteria)
    {
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

    private static string GetReachedRule(IEnumerable<MonitorCriteriaModel> criterias, int ruleId)
    {
        var data = criterias.Where(r => r.RuleId == ruleId)
            .Select(s => $"{s.CriteriaValue} {s.PostFix}");
        return !data.Any() ? string.Empty : string.Join('|', data);
    }
}