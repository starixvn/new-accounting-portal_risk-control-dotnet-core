using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Update;

public class Handler(IDynamicRepository repository, UserHttpContext userHttpContext, IMapper mapper)
    : IRequestHandler<GameGroupSettingRequest, ExecuteResult>
{
    public async Task<ExecuteResult> Handle(GameGroupSettingRequest request, CancellationToken cancellationToken)
    {
        var userContext = new UserContext { UserId = userHttpContext.UserId, IP = userHttpContext.IP };
        var criteriaList = GetGameGroupSettingCriteriaList(request.Settings, userContext);
        var executeResults = criteriaList.Select(c => repository.ExecuteAsync(c)).ToArray();

        await Task.WhenAll(executeResults);

        return new ExecuteResult();
    }

    public IEnumerable<GameGroupSettingCriteria> GetGameGroupSettingCriteriaList(IEnumerable<GameGroupSettingModel> settings, UserContext userContext)
    {
        var criteriaList = new List<GameGroupSettingCriteria>();
        foreach (var setting in settings)
        {
            var criteria = mapper.Map<GameGroupSettingCriteria>(setting);
            criteria.UserID = userContext.UserId;
            criteria.IP = userContext.IP;
            criteriaList.Add(criteria);
        }
        return criteriaList;
    }
}