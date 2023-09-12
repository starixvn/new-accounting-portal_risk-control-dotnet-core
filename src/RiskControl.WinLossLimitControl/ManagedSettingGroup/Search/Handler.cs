using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.ManagedSettingGroup.Search;

public class Handler : IRequestHandler<RepresentativeBettypeRequest, RepresentativeBettypeModel>,
    IRequestHandler<UnassignedBettypeRequest, IEnumerable<UnassignedBettypeModel>>,
    IRequestHandler<GroupSettingRequest, IEnumerable<GroupGroupSettingModel>>
{
    private readonly IDynamicRepository repository;
    private readonly IMapper mapper;

    public Handler(IDynamicRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<RepresentativeBettypeModel> Handle(RepresentativeBettypeRequest request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<RepresentativeBettypeCriteria>(request);

        return await repository.GetAsync<RepresentativeBettypeModel>(criteria, cancellationToken);
    }

    public async Task<IEnumerable<UnassignedBettypeModel>> Handle(UnassignedBettypeRequest request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<UnassignedBettypeCriteria>(request);

        return await repository.FetchAsync<UnassignedBettypeModel>(criteria, cancellationToken);
    }

    public async Task<IEnumerable<GroupGroupSettingModel>> Handle(GroupSettingRequest request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<GroupSettingCriteria>(request);

        var rawData = await repository.FetchAsync<GroupSettingModel>(criteria, cancellationToken);
        return rawData.GroupBy(x => new { x.GroupID, x.GroupName, x.ProductID }).Select(g => new GroupGroupSettingModel
        {
            GroupID = g.Key.GroupID,
            GroupName = g.Key.GroupName,
            ProductID = g.Key.ProductID,
            Items = g.ToList()
        });
    }
}