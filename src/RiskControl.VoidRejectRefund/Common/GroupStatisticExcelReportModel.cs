using System.Collections.Generic;

namespace RiskControl.VoidRejectRefund.Common
{
    public class GroupStatisticExcelReportModel
    {
        public List<GroupStatisticExcelModel> Statistics { get; set; }

        public CurrencyStatisticExcelModel GrandTotal { get; set; }
    }
}
