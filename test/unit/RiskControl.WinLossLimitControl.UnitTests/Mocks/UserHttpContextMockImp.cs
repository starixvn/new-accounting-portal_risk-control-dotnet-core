using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.UnitTests.Mocks;

public class UserHttpContextMockImp : UserHttpContext
{
    public string IP => "127.0.0.1";

    public int UserId => 1;

    public int SiteId => 1;
}