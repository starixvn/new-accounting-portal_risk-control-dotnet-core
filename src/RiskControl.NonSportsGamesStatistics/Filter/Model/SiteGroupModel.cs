using System.Collections.Generic;

namespace RiskControl.NonSportsGamesStatistics.Filter.Model;

public class SiteGroupModel
{
    public int GroupId { get; set; }

    public string GroupName { get; set; }

    public int ParentId { get; set; }

    public int LicenseeId { get; set; }

    public string LicenseeName { get; set; }

    public List<SiteGroupModel> ChildGroups { get; set; }

    public List<LicenseeModel> ChildItems { get; set; }
}