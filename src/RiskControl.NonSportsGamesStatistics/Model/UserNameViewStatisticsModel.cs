using Epplus.Mapper.Annotations;

namespace RiskControl.NonSportsGamesStatistics.Model;

public class UserNameViewStatisticsModel : StatisticModel
{
    [Cell("B5")]
    public string ReportById { get; set; }

    [Cell("A5")]
    public string ReportBy { get; set; }

    public int NoOfPlayers { get; set; }

    public int RoleId { get; set; }

    public string RoleName { get; set; }

    [Cell("P5")]
    public decimal HousePositionTaking { get; set; }

    public string SiteName { get; set; }
}