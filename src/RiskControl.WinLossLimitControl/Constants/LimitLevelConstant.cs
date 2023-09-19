namespace RiskControl.WinLossLimitControl.Constants;

public static class LimitLevelConstant
{
    public const int OrangeLevel = 1;

    public const int YellowLevel = 2;

    public const int RedLevel = 3;

    public const int GreyLevel = 101;

    public const int BlackLevel = 102;

    public static bool IsWinLimitLevel(int level)
    {
        return level is OrangeLevel or YellowLevel or RedLevel;
    }

    public static bool IsLossLimitLevel(int level)
    {
        return level is GreyLevel or BlackLevel;
    }
}