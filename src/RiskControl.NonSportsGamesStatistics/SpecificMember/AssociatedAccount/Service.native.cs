using AutoMapper;
using RiskControl.CoreNew.AssociatedAcccount;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.SpecificMember.AssociatedAccount
{
    public class ServiceImp : Service<UserNameViewReportModel>
    {
        private readonly UsernameService service;
        private readonly AssociatedAccountService associatedAccountService;
        private readonly IMapper mapper;

        public ServiceImp(
            UsernameService service,
            AssociatedAccountService associatedAccountService,
            IMapper mapper)
        {
            this.service = service;
            this.associatedAccountService = associatedAccountService;
            this.mapper = mapper;
        }

        public async Task<UserNameViewReportModel> Query(BaseStatisticCriteria criteria, DateTime winLossDate)
        {
            var associatedAccounts = await GetAssociatedAccounts(criteria.CustId).ConfigureAwait(false);
            criteria.UserName = string.Join(",", associatedAccounts);
            criteria.Site = "All";

            var historyCriteria = mapper.Map<UsernameHistoryCriteria>(criteria);
            var normalCriteria = mapper.Map<UsernameNormalCriteria>(criteria);
            normalCriteria.IsNormalMode = true;

            return await service.Query(historyCriteria, normalCriteria).ConfigureAwait(false);
        }

        private async Task<IEnumerable<string>> GetAssociatedAccounts(int custId)
        {
            var associatedByDevice = await associatedAccountService.GetAssociatedByDevice(custId);
            var associatedByManual = await associatedAccountService.GetAssociatedByManual(custId);
            var associatedByIp = await associatedAccountService.GetAssociateddByIp(custId);

            var associatedAccounts = associatedByDevice.Concat(associatedByManual).Concat(associatedByIp);
            var usenames = associatedAccounts.Select(x => x.Username);

            return usenames;
        }
    }
}