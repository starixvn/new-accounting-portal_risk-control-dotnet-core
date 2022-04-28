using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Common
{
    public interface UsernameService
    {
        Task<UserNameViewReportModel> Query(BaseHistoryCriteria historyCriteria, BaseNormalCriteria normalCriteria);
    }

    public class UsernameServiceImp : UsernameService
    {
        private readonly RawService rawService;
        private readonly CalculationService service;
        private readonly IMapper mapper;

        public UsernameServiceImp(RawService rawService, CalculationService service, IMapper mapper)
        {
            this.rawService = rawService;
            this.service = service;
            this.mapper = mapper;
        }

        public async Task<UserNameViewReportModel> Query(BaseHistoryCriteria historyCriteria, BaseNormalCriteria normalCriteria)
        {
            var usernameRawData = new GenericRawData<UserNameViewRawStatistics>();
            var rawData = await rawService.QueryDataFromBettransAndWarehouse<UserNameViewRawStatistics>(historyCriteria, normalCriteria);

            usernameRawData.RawStatistics = CalculateRawStatistics(rawData.RawStatistics);
            usernameRawData.Total = CalculateTotal(rawData.Total);

            return service.CalculateUserNameViewReport(usernameRawData);
        }

        private IEnumerable<UserNameViewRawStatistics> CalculateRawStatistics(IEnumerable<UserNameViewRawStatistics> rawStatistics)
        {
            var groups = rawStatistics.GroupBy(x => new { x.ReportById, x.ReportBy });

            var result = from @group in groups
                         let usernames = rawStatistics.Where(x => x.ReportById == @group.Key.ReportById)
                         select CalculateMemberStatistics(usernames);

            return result;
        }

        private UserNameViewRawStatistics CalculateMemberStatistics(IEnumerable<UserNameViewRawStatistics> rawStatistics)
        {
            var baseTotal = service.CalculateSum(rawStatistics);
            var total = mapper.Map<UserNameViewRawStatistics>(baseTotal);
            total.RoleId = rawStatistics.FirstOrDefault().RoleId;
            total.RoleName = rawStatistics.FirstOrDefault().RoleName;
            total.SiteName = rawStatistics.FirstOrDefault().SiteName;

            return total;
        }

        private List<UserNameViewRawStatistics> CalculateTotal(IEnumerable<UserNameViewRawStatistics> rawStatistics)
        {
            var baseTotal = service.CalculateSum(rawStatistics);
            var total = mapper.Map<UserNameViewRawStatistics>(baseTotal);
            return new List<UserNameViewRawStatistics>
            {
                total
            };
        }
    }
}