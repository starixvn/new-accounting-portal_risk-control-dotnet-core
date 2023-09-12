using RiskControl.NonSportsGamesStatistics.Common;

namespace RiskControl.NonSportsGamesStatistics.RawData;

public class UserNameViewRawStatistics : BaseRawStatistic
{
    public int RoleId { get; set; }

    public string RoleName { get; set; }

    public decimal HousePositionTaking { get; set; }

    public string SiteName { get; set; }
}