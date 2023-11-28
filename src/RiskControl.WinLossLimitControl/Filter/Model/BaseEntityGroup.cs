using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.Filter.Model;

public class BaseEntityGroup
{
    public IDictionary<int, string> Currencies { get; set; } = new Dictionary<int, string>();

    public IDictionary<int, string> Groups { get; set; } = new Dictionary<int, string>();

    public IDictionary<int, string> Products { get; set; } = new Dictionary<int, string>();

    public IDictionary<int, string> Sites { get; set; } = new Dictionary<int, string>();
}