using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model;

public class GameTypeModel
{
    public int GameTypeId { get; set; }

    public string GameTypeNo { get; set; }

    public EnglishName GameTypeName { get; set; }

    public string GameTypeNameAlias => GameTypeName == null
        ? string.Empty
        : GameTypeName.EN;
}