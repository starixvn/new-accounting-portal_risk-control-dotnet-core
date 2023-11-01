using RiskControl.Sort;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;

namespace RiskControl.NonSportsGamesStatistics.UserNameView.Main;

public class SortingServiceImp : SortingService<UserNameViewReportModel>
{
    public UserNameViewReportModel SortData(UserNameViewReportModel reportModel, string sortDirection, string sortColumnName)
    {
        SortUtility.SortByProperty(reportModel.Statistics, sortDirection, sortColumnName);
        return reportModel;
    }
}