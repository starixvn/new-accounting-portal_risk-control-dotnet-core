namespace RiskControl.WinLossLimitControl.Constants;

public static class LimitLevelConstant
{
    public const int OrangeLevel = 1;

    public const string OrangeLevelText = "Orange";

    public const int YellowLevel = 2;

    public const string YellowLevelText = "Yellow";

    public const int RedLevel = 3;

    public const string RedLevelText = "Red";

    public const int GreyLevel = 101;

    public const string GreyLevelText = "Grey";

    public const int BlackLevel = 102;

    public const string BlackLevelText = "Black";

    public static bool IsWinLimitLevel(int level)
    {
        return level is OrangeLevel or YellowLevel or RedLevel;
    }

    public static bool IsLossLimitLevel(int level)
    {
        return level is GreyLevel or BlackLevel;
    }
}