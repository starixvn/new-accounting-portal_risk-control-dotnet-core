using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.Filter;

namespace RiskControl.WinLossLimitControl.Groups;

public class Handler(IDynamicRepository repository, CacheRefService cacheRefService)
    : IRequestHandler<Request, List<ProductGroupSetting>>
{
    public async Task<List<ProductGroupSetting>> Handle(Request request, CancellationToken cancellationToken)
    {
        var criteria = new ReadCriteria();
        var settings = await repository.FetchAsync<GroupSetting>(criteria);
        var groupSettings = settings
            .Where(s => s.ProductId == request.ProductId)
            .ToList();
        var result = new List<ProductGroupSetting>();

        var groups = groupSettings.GroupBy(s => s.GroupId)
            .Select(g => new GroupBetTypeSetting
            {
                GroupName = cacheRefService.GetGroupName(g.Key),
                BetTypes = GetBetTypeNames(g.ToList())
            })
            .ToList();

        var productGroupSetting = new ProductGroupSetting
        {
            ProductId = request.ProductId,
            ProductName = cacheRefService.GetProductName(request.ProductId),
            Groups = groups
        };

        result.Add(productGroupSetting);

        return result;
    }

    private List<string> GetBetTypeNames(IEnumerable<GroupSetting> settings)
    {
        var betTypes = settings.Select(s => (s.BetTypeId, s.SportId)).Distinct();

        return betTypes.Select(b => GetSportBettypeName(b.SportId, b.BetTypeId)).ToList();
    }

    private string GetSportBettypeName(int sportId, int betTypeId)
    {
        var sportName = cacheRefService.GetSportName(sportId);
        sportName = string.IsNullOrEmpty(sportName) ? string.Empty : $"({sportName})";

        var betTypeName = cacheRefService.GetBetTypeName(betTypeId);

        return $"{betTypeName} {sportName}";
    }
}