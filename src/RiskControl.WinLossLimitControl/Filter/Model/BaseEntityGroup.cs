using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.Filter.Model;

public class BaseEntityGroup
{
    public BaseEntityGroup()
    {
        Currencies = new Dictionary<int, string>();
        Groups = new Dictionary<int, string>();
        Products = new Dictionary<int, string>();
        Sites = new Dictionary<int, string>();
    }

    public IDictionary<int, string> Currencies { get; set; }

    public IDictionary<int, string> Groups { get; set; }

    public IDictionary<int, string> Products { get; set; }

    public IDictionary<int, string> Sites { get; set; }
}