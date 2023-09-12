using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model;

public class JackpotTypeModel
{
    public int JackpotTypeId { get; set; }

    public EnglishName JackpotTypeName { get; set; }

    public int GameTypeId { get; set; }

    public int GameGroupId { get; set; }

    public string JackpotTypeNameAlias => JackpotTypeName == null
        ? string.Empty
        : JackpotTypeName.EN;
}