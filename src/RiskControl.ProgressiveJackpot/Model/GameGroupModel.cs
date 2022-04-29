using RiskControl.ProgressiveJackpot.ApiModel;

namespace RiskControl.ProgressiveJackpot.Model
{
    public class GameGroupModel
    {
        public int GameGroupId { get; set; }

        public EnglishName GameGroupName { get; set; }

        public string GameGroupNameAlias => GameGroupName == null
                    ? string.Empty
                    : GameGroupName.EN;
    }
}
