using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Common
{
    public class BaseNormalCriteria : BaseStatisticCriteria
    {
        public DateTime WinLostDate { get; set; }

        public int HousePTType { get; set; }

        public decimal HousePTValue { get; set; }

        public bool IsDrillDown { get; set; }

        public bool IsGrandTotal { get; set; }
    }
}
