using Fanex.NAP.Client.AspNetCore.Attributes;
using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Services;
using Fanex.NAP.Core.Business;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiskControl.Core.Model;

namespace RiskControl.Sites.Controllers
{
    public class HomeController : Controller
    {
        private readonly IUserService userService;

        private readonly INapSession currentSession;

        private readonly INapSettings napSettings;

        public HomeController(INapSession currentSession, IUserService userService, INapSettings napSettings)
        {
            this.currentSession = currentSession;
            this.userService = userService;
            this.napSettings = napSettings;
        }

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

        [Route("Reports/VoidRejectRefund/Index")]
        [NapAuth(FunctionKey = FunctionKeys.VoidRejectRefund, Policy = Constant.Policy.Read)]
        public ActionResult VoidRejectRefund()
        {
            return View("~/wwwroot/void-reject-refund/index.cshtml");
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

        [Route("Reports/NonSportsSpecificMember")]
        [NapAuth(FunctionKey = FunctionKeys.NonSportGameStatisticsSpecificMember, Policy = Constant.Policy.Read)]
        public ActionResult NonSportsSpecificMember()
        {
            return View("~/wwwroot/non-sports-specific-member/index.cshtml");
        }
    }
}
