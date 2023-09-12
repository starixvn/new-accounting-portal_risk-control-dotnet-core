namespace RiskControl.NonSportsGamesStatistics.Common;

public interface DataSourceChooser
{
    string GetDataSource(bool isNormalMode);
}

public class DataSourceChooserImp : DataSourceChooser
{
    private const string BetTrans = "Bettrans";

    private const string Warehouse = "Warehouse";

    public string GetDataSource(bool isNormalMode)
    {
        return isNormalMode ? BetTrans : Warehouse;
    }
}