using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using Microsoft.Extensions.Configuration;
using RiskControl.WinLossLimitControl.Constants;
using RiskControl.WinLossLimitControl.CurrencySettings.Model;
using RiskControl.WinLossLimitControl.Extensions;
using RiskControl.WinLossLimitControl.Models;

namespace RiskControl.WinLossLimitControl.CurrencySettings.Update;

public interface UpdateService
{
    Task Execute(List<CurrencySetting> currencySettings, UserContext userContext);
}

public class UpdateServiceImp : UpdateService
{
    private readonly IDynamicRepository repository;
    private readonly IConfiguration configuration;

    public UpdateServiceImp(IDynamicRepository repository, IConfiguration configuration)
    {
        this.repository = repository;
        this.configuration = configuration;
    }

    public async Task Execute(List<CurrencySetting> currencySettings, UserContext userContext)
    {
        var criteriaList = GetUpdateCurrencyWinLimitCriteria(currencySettings, userContext);
        var executeResults = criteriaList.Select(c => repository.ExecuteAsync(c)).ToArray();

        await Task.WhenAll(executeResults);
    }

    private IEnumerable<UpdateCriteria> GetUpdateCurrencyWinLimitCriteria(IEnumerable<CurrencySetting> currencySettings, UserContext userContext)
    {
        var itemsPerBatch = int.Parse(configuration["ItemsPerBatch"]);
        var list = currencySettings.Select(GetUpdateCurrencyWinLimitAllLevel)
            .SelectMany(c => c);
        var criteriaList = new List<UpdateCriteria>();
        for (var i = 0; i < list.Count(); i += itemsPerBatch)
        {
            var models = list.Skip(i).Take(itemsPerBatch);
            var criteria = new UpdateCriteria
            {
                Xml = models.ToCurrencySettingXml(),
                UserId = userContext.UserId,
                IP = userContext.IP
            };
            criteriaList.Add(criteria);
        }
        return criteriaList;
    }

    private static IEnumerable<UpdateSiteModel> GetUpdateCurrencyWinLimitAllLevel(CurrencySetting currencySetting)
    {
        yield return GetUpdateCurrencyBlackLevel(currencySetting);
        yield return GetUpdateCurrencyGreyLevel(currencySetting);
        yield return GetUpdateCurrencyOrangeLevel(currencySetting);
        yield return GetUpdateCurrencyYellowLevel(currencySetting);
        yield return GetUpdateCurrencyRedLevel(currencySetting);
    }

    private static UpdateSiteModel GetUpdateCurrencyBlackLevel(CurrencySetting currencySetting)
    {
        var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
        defaultLevel.LevelId = LimitLevelConstant.BlackLevel;
        defaultLevel.MaxWinLimit = currencySetting.BlackLimit;

        return defaultLevel;
    }

    private static UpdateSiteModel GetUpdateCurrencyGreyLevel(CurrencySetting currencySetting)
    {
        var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
        defaultLevel.LevelId = LimitLevelConstant.GreyLevel;
        defaultLevel.MaxWinLimit = currencySetting.GreyLimit;

        return defaultLevel;
    }

    private static UpdateSiteModel GetUpdateCurrencyOrangeLevel(CurrencySetting currencySetting)
    {
        var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
        defaultLevel.LevelId = LimitLevelConstant.OrangeLevel;
        defaultLevel.MaxWinLimit = currencySetting.OrangeLimit;

        return defaultLevel;
    }

    private static UpdateSiteModel GetUpdateCurrencyYellowLevel(CurrencySetting currencySetting)
    {
        var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
        defaultLevel.LevelId = LimitLevelConstant.YellowLevel;
        defaultLevel.MaxWinLimit = currencySetting.YellowLimit;

        return defaultLevel;
    }

    private static UpdateSiteModel GetUpdateCurrencyRedLevel(CurrencySetting currencySetting)
    {
        var defaultLevel = GetUpdateCurrencyDefaultLevel(currencySetting);
        defaultLevel.LevelId = LimitLevelConstant.RedLevel;
        defaultLevel.MaxWinLimit = currencySetting.RedLimit;

        return defaultLevel;
    }

    private static UpdateSiteModel GetUpdateCurrencyDefaultLevel(CurrencySetting currencySetting)
    {
        return new UpdateSiteModel
        {
            ProductId = currencySetting.ProductId,
            GroupId = currencySetting.GroupId,
            CurrencyId = currencySetting.CurrencyId,
            SiteId = currencySetting.SiteId,
            IsBlockedPlaceBet = currencySetting.IsBlockedPlacebetRedLevel,
            IsBlockedTransfer = currencySetting.IsBlockedTransferRedLevel
        };
    }
}