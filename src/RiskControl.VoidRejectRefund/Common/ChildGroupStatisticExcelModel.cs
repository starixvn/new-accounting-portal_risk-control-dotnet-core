using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Common;

public class ChildGroupStatisticExcelModel
{
    public string GroupName { get; set; }

    public List<CurrencyStatisticExcelModel> Statistics { get; set; }
}