using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Constants;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.PlayerSettings.Insert.Criteria;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Insert;

public interface InsertService
{
    Task Execute(List<PlayerSetting> playerSettings, UserContext userContext);
}

public class InsertServiceImp : InsertService
{
    private readonly IDynamicRepository repository;

    public InsertServiceImp(IDynamicRepository repository)
    {
        this.repository = repository;
    }

    public async Task Execute(List<PlayerSetting> playerSettings, UserContext userContext)
    {
        var criteriaList = playerSettings
            .Select(s => GetAllLevelCriteria(s, userContext))
            .SelectMany(c => c);

        var executeResuls = criteriaList
            .Select(c => repository.ExecuteAsync(c))
            .ToArray();
        await Task
            .WhenAll(executeResuls);
    }

    private IEnumerable<InsertCriteria> GetAllLevelCriteria(PlayerSetting playerSetting, UserContext userContext)
    {
        yield return GetBlackLevelInsertCriteria(playerSetting, userContext);
        yield return GetGreyLevelInsertCriteria(playerSetting, userContext);
        yield return GetOrangeLevelInsertCriteria(playerSetting, userContext);
        yield return GetYellowLevelInsertCriteria(playerSetting, userContext);
        yield return GetRedLevelInsertCriteria(playerSetting, userContext);
    }

    private InsertCriteria GetBlackLevelInsertCriteria(PlayerSetting playerSetting, UserContext userContext)
    {
        var defaultLevel = CreateInsertCriteria(playerSetting, userContext);
        defaultLevel.LevelId = LimitLevelConstant.BlackLevel;
        defaultLevel.MaxWinLimit = playerSetting.BlackLimit;

        return defaultLevel;
    }

    private InsertCriteria GetGreyLevelInsertCriteria(PlayerSetting playerSetting, UserContext userContext)
    {
        var defaultLevel = CreateInsertCriteria(playerSetting, userContext);
        defaultLevel.LevelId = LimitLevelConstant.GreyLevel;
        defaultLevel.MaxWinLimit = playerSetting.GreyLimit;

        return defaultLevel;
    }

    private InsertCriteria GetOrangeLevelInsertCriteria(PlayerSetting playerSetting, UserContext userContext)
    {
        var defaultLevel = CreateInsertCriteria(playerSetting, userContext);
        defaultLevel.LevelId = LimitLevelConstant.OrangeLevel;
        defaultLevel.MaxWinLimit = playerSetting.OrangeLimit;

        return defaultLevel;
    }

    private InsertCriteria GetYellowLevelInsertCriteria(PlayerSetting playerSetting, UserContext userContext)
    {
        var defaultLevel = CreateInsertCriteria(playerSetting, userContext);
        defaultLevel.LevelId = LimitLevelConstant.YellowLevel;
        defaultLevel.MaxWinLimit = playerSetting.YellowLimit;

        return defaultLevel;
    }

    private InsertCriteria GetRedLevelInsertCriteria(PlayerSetting playerSetting, UserContext userContext)
    {
        var defaultLevel = CreateInsertCriteria(playerSetting, userContext);
        defaultLevel.LevelId = LimitLevelConstant.RedLevel;
        defaultLevel.MaxWinLimit = playerSetting.RedLimit;

        return defaultLevel;
    }

    private InsertCriteria CreateInsertCriteria(PlayerSetting playerSetting, UserContext userContext)
    {
        return new InsertCriteria
        {
            CustId = playerSetting.CustId,
            ProductId = playerSetting.ProductId,
            GroupId = playerSetting.GroupId,
            CurrencyId = playerSetting.CurrencyId,
            SiteId = playerSetting.SiteId,
            UserId = userContext.UserId,
            IP = userContext.IP
        };
    }
}