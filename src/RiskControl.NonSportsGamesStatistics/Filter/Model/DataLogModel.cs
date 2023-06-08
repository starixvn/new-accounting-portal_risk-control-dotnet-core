using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Filter.Model
{
    public class DataLogModel
    {
        public List<GameTypeModel> GameTypes { get; set; }

        public List<ProductModel> Product { get; set; }

        public List<GameTypeModel> SelectedGameTypes { get; set; }
    }
}
