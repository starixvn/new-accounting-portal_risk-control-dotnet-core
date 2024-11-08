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
            item.GameIncome = rawData.Item2.FirstOrDefault(r => r.RuleId == item.RuleId && r.CriteriaId == CriteriaTypeConstants.GameIncome)?.CriteriaValue;
            item.GamePayout = rawData.Item2.FirstOrDefault(r => r.RuleId == item.RuleId && r.CriteriaId == CriteriaTypeConstants.GamePayout)?.CriteriaValue;
            item.ProductList = rawData.Item3.Where(p => p.RuleId == item.RuleId).Select(s => s.ProductName).ToArray();
        });
        return data;
    }
}