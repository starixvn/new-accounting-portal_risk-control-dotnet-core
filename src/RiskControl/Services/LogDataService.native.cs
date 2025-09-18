using Fanex.Logging;

namespace RiskControl.Services;

public interface LogDataService
{
    void Log(string message);
}

public class LogDataServiceImp : LogDataService
{
    public void Log(string message)
    {
        LogService.Info(message);
    }
}