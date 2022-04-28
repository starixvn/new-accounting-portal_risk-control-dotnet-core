using System;
using System.Threading.Tasks;
using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.Username
{
    public class ServiceImp : Service<UserNameViewReportModel>
    {
        private readonly UsernameService service;
        private readonly IMapper mapper;

        public ServiceImp(UsernameService service, IMapper mapper)
        {
            this.service = service;
            this.mapper = mapper;
        }

        public async Task<UserNameViewReportModel> Query(BaseStatisticCriteria criteria, DateTime winLossDate)
        {
            var historyCriteria = mapper.Map<UsernameHistoryCriteria>(criteria);
            var normalCriteria = mapper.Map<UsernameNormalCriteria>(criteria);
            normalCriteria.IsNormalMode = true;

            return await service.Query(historyCriteria, normalCriteria).ConfigureAwait(false);
        }
    }
}
