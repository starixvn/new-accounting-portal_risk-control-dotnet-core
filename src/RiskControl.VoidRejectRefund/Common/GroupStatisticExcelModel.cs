using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Common;

public class GroupStatisticExcelModel
{
    public CurrencyStatisticExcelModel Total { get; set; }

    public List<ChildGroupStatisticExcelModel> Statistics { get; set; }
}