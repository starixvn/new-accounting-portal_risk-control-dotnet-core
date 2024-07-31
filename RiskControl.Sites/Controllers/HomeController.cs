using Microsoft.AspNetCore.Mvc;
using RiskControl.Model;

namespace RiskControl.Sites.Controllers;

using Fanex.NAP.Client.Attributes;
using Fanex.NAP.Client.Helpers.Business;
using RiskControl.Configuration;

public class HomeController(ConfigurationService configurationService) : Controller
{
    public ActionResult Index()
    {
        return View();

    }

    [Route("Dashboard/Index")]
    [NapAuth(FunctionKey = FunctionKeys.RiskControlDashboard, Policy = Constant.Policy.Read)]
    public ActionResult Dashboard()
    {
        return View("~/wwwroot/dashboard/index.cshtml");
    }

    [Route("NonSportGameStatistics/Main/Index")]
    [NapAuth(FunctionKey = FunctionKeys.NonSportGameStatistics, Policy = Constant.Policy.Read)]
    public ActionResult NonSportsGamesStatistics()
    {
        return View("~/wwwroot/non-sports-statistics/index.cshtml");
    }

    [Route("WinLimitControl/CurrencySetting/Index")]
    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
    public ActionResult CurrencySetting()
    {
        return View("~/wwwroot/currency-setting/index.cshtml");
    }

    [Route("WinLimitControl/ManageSettingGroup/Index")]
    [NapAuth(FunctionKey = FunctionKeys.CurrencyWinLimitSetting, Policy = Constant.Policy.Read)]
    public ActionResult ManageSettingGroup()
    {
        return View("~/wwwroot/manage-setting-group/index.cshtml");
    }

    [Route("WinLimitControl/PlayerSetting/Index")]
    [NapAuth(FunctionKey = FunctionKeys.PlayerWinLimitManagement, Policy = Constant.Policy.Read)]
    public ActionResult PlayerSetting()
    {
        return View("~/wwwroot/player-setting/index.cshtml");
    }

    [Route("WinLimitControl/WinLimitMonitor/Index")]
    [NapAuth(FunctionKey = FunctionKeys.WinLimitMonitor, Policy = Constant.Policy.Read)]
    public ActionResult WinLimitMonitor()
    {
        ViewBag.DownfileApi = configurationService.DownFileApi;
        return View("~/wwwroot/monitor/index.cshtml");
    }

    [Route("BettingMonitoring/BettingMonitoringLoad/Index")]
    [NapAuth(FunctionKey = FunctionKeys.BetSettingMonitoring, Policy = Constant.Policy.Host)]
    public ActionResult BettingMonitoring()
    {
        return View("~/wwwroot/betting-monitoring/index.cshtml");
    }

    [Route("Reports/ProgressiveJackpot/Index")]
    [NapAuth(FunctionKey = FunctionKeys.ProgressiveJackpot, Policy = Constant.Policy.Read)]
    public ActionResult ProgressiveJackpot()
    {
        return View("~/wwwroot/progressive-jackpot/index.cshtml");
    }
    
    [Route("GameRound/Setting")]
    [NapAuth(FunctionKey = FunctionKeys.GameRoundBetLimitSetting, Policy = Constant.Policy.Read)]
    public ActionResult GameRoundSetting()
    {
        return View("~/wwwroot/game-round-bet-limit-setting/index.cshtml");
    }

    [Route("GameRound/Monitor")]
    [NapAuth(FunctionKey = FunctionKeys.GameRoundBetLimitMonitor, Policy = Constant.Policy.Read)]
    public ActionResult GameRoundMonitor()
    {
        return View("~/wwwroot/game-round-bet-limit-monitor/index.cshtml");
    }
}