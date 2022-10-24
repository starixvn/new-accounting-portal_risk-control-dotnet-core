using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Helpers.Web;
using Fanex.NAP.Client.Models.ParameterObject;

namespace RiskControl.WinLossLimitControl.Services
{
    public interface UserHttpContext
    {
        string IP { get; }

        int SiteId { get; }

        int UserId { get; }
    }

    public class UserHttpContextImp : UserHttpContext
    {
        private readonly INapSession currentSession;

        private readonly INapSettings napSettings;

        public UserHttpContextImp(INapSession currentSession, INapSettings napSettings)
        {
            this.currentSession = currentSession;
            this.napSettings = napSettings;
        }

        public string IP => new LoginParameter().Ip;

        public int UserId => currentSession.UserId;

        public int SiteId => napSettings.SiteId;
    }
}