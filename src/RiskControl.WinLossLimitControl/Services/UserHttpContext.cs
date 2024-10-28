using Fanex.NAP.Client.Configuration;
using Fanex.NAP.Client.Models.ParameterObject;

namespace RiskControl.WinLossLimitControl.Services;

using Fanex.NAP.Client;

public interface UserHttpContext
{
    string IP { get; }

    int SiteId { get; }

    int UserId { get; }
}

public class UserHttpContextImp(INapSession currentSession, INapSettings napSettings) : UserHttpContext
{
    public string IP => new LoginParameter().Ip;

    public int UserId => currentSession.UserId;

    public int SiteId => napSettings.SiteId;
}