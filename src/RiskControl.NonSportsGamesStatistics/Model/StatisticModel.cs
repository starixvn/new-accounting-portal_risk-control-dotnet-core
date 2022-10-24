using Epplus.Mapper.Annotations;
using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.Model
{
    public class StatisticModel : BaseStatisticModel
    {
        public int CurrencyId { get; set; }

        [Cell("D5")]
        public string Currency { get; set; }
    }
}
