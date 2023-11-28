using AutoMapper;
using Fanex.Data.Repository;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Entities;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter;

public interface FilterService
{
    Task<List<SiteGroupModel>> GetSiteGroups(string productId);
}

public class FilterServiceImp(IDynamicRepository repository, IMapper mapper) : FilterService
{
    public async Task<List<SiteGroupModel>> GetSiteGroups(string productId)
    {
        const int NEGATIVE_ONE_THOUSAND = -1000;

        var result = new List<SiteGroupModel>();
        var criteria = new SiteCriteria { ProductId = productId };

        var (firstResultSet, secondResultSet) = await repository.FetchMultipleAsync<SiteGroupEntity, LicenseeEntity>(criteria);

        var licenseeItemsOfCredit = firstResultSet.Where(x => x.GroupId <= NEGATIVE_ONE_THOUSAND);
        var creditGroup = CreateSiteGroup("Credit Group", licenseeItemsOfCredit, secondResultSet);
        var specialLicensees = CreateSpecialChild(secondResultSet);
        creditGroup.ChildGroups.AddRange(specialLicensees);
        result.Add(creditGroup);

        var licenseeItemsOfDeposit = firstResultSet.Where(x => x.GroupId > NEGATIVE_ONE_THOUSAND);
        var depositGroup = CreateSiteGroup("Licensee Group", licenseeItemsOfDeposit, secondResultSet);
        result.Add(depositGroup);

        MoveChildItemsToChildGroups(result);

        return result;
    }

    private SiteGroupModel CreateSiteGroup(string groupName, IEnumerable<SiteGroupEntity> siteGroups, IEnumerable<LicenseeEntity> licenseeEntities)
    {
        var groups = CreateGroup(siteGroups);
        CreateChild(groups, licenseeEntities);

        var result = new SiteGroupModel
        {
            GroupName = groupName,
            ChildGroups = groups
        };
        return result;
    }

    public void MoveChildItemsToChildGroups(List<SiteGroupModel> siteGroups)
    {
        foreach (var item in siteGroups)
        {
            if (item.ChildItems is { Count: > 0 })
            {
                var childGroups = mapper.Map<List<SiteGroupModel>>(item.ChildItems);

                item.ChildGroups ??= new List<SiteGroupModel>();

                item.ChildGroups.AddRange(childGroups);
                item.ChildItems.RemoveRange(0, item.ChildItems.Count);
            }

            if (item.ChildGroups is { Count: > 0 })
            {
                MoveChildItemsToChildGroups(item.ChildGroups);
            }
        }
    }

    private static List<SiteGroupModel> CreateSpecialChild(IEnumerable<LicenseeEntity> licenseeEntities)
    {
        var licensees = licenseeEntities.Where(x => x.GroupId == 0);
        return licensees.Select(item => new SiteGroupModel
        {
            ParentId = 0,
            GroupId = 0,
            GroupName = item.LicenseeName,
            LicenseeName = item.LicenseeName,
            LicenseeId = item.LicenseeId
        })
        .ToList();
    }

    private void CreateChild(List<SiteGroupModel> siteGroups, IEnumerable<LicenseeEntity> licenseeEntities)
    {
        foreach (var item in siteGroups)
        {

            var groupLicenseeEntities = licenseeEntities.Where(x => x.GroupId == item.GroupId);
            var groupLicensees = mapper.Map<List<LicenseeModel>>(groupLicenseeEntities);
            item.ChildItems = groupLicensees;

            if (item.ChildGroups is { Count: > 0 })
            {
                CreateChild(item.ChildGroups, licenseeEntities);
            }
        }
    }

    private List<SiteGroupModel> CreateGroup(IEnumerable<SiteGroupEntity> entities)
    {
        var parentItems = entities.Where(x => x.ParentId == 0);
        var result = mapper.Map<List<SiteGroupModel>>(parentItems);
        var childItems = GetChildItems(entities);
        UpdateChildItems(childItems);

        for (var i = 0; i < result.Count; i++)
        {
            var groupId = result[i].GroupId;
            var siteGroupModels = childItems.Where(group => group.GroupId == groupId);
            foreach (var group in siteGroupModels)
            {
                result[i] = group;
            }
        }

        return result;
    }

    private List<SiteGroupModel> GetChildItems(IEnumerable<SiteGroupEntity> entities)
    {
        var result = new List<SiteGroupModel>();
        foreach (var item in entities)
        {
            var groupItem = mapper.Map<SiteGroupModel>(item);
            var childItems = entities.Where(x => x.ParentId == item.GroupId);

            if (childItems.Any())
            {
                groupItem.ChildGroups = mapper.Map<List<SiteGroupModel>>(childItems);
                result.Add(groupItem);
            }
        }

        return result;
    }

    private static void UpdateChildItems(List<SiteGroupModel> siteGroups)
    {
        foreach (var parentItem in siteGroups)
        {
            foreach (var childItem in parentItem.ChildGroups)
            {
                var childItems = siteGroups.Where(x => x.GroupId == childItem.GroupId);

                if (childItems.Any())
                {
                    childItem.ChildGroups = childItems.ToList();
                }
            }
        }
    }
}