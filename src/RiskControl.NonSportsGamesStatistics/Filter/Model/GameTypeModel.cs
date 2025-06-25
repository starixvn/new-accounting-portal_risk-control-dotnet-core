namespace RiskControl.NonSportsGamesStatistics.Filter.Model;

public class GameTypeModel
{
    public int ProductId { get; set; }

    public int TypeId { get; set; }

    public string TypeName { get; set; }

    public bool IsTest { get; set; }

    public byte GameType { get; set; }

    public bool IsPrize { get; set; }
}