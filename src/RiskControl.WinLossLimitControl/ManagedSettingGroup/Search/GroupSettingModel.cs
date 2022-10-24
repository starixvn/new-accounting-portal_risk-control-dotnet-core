using System.Collections.Generic;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search
{
    public class GroupSettingModel
    {
        public int ProductID { get; set; }

        public int GroupID { get; set; }

        public string GroupName { get; set; }

        public int BetTypeID { get; set; }

        public string Typenamee { get; set; }

        public bool Selected { get; set; }

        public bool IsLegend { get; set; }
    }

    public class GroupGroupSettingModel
    {
        public int GroupID { get; set; }

        public string GroupName { get; set; }

        public int ProductID { get; set; }

        public bool Selected { get; set; }

        public int MaxItems { get; set; } = 10;

        public List<GroupSettingModel> Items { get; set; }
    }
}
