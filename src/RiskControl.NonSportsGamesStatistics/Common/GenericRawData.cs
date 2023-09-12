using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Common;

public class GenericRawData<T> where T : class
{
    public IEnumerable<T> RawStatistics { get; set; } = new List<T>();

    public IEnumerable<T> Total { get; set; } = new List<T>();
}