using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Filter.Model
{
    public class Permission
    {
        public IEnumerable<string> Modes { get; set; }

        public IEnumerable<string> Products { get; set; }
    }
}