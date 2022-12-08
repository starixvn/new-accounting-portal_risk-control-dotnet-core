using AutoMapper;
using Fanex.Data.Repository;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Entities;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter
{
    public interface FilterService
    {
        Task<List<SiteGroupModel>> GetSiteGroups(string productId);
    }

    public class FilterServiceImp : FilterService
    {
        private readonly IDynamicRepository repository;

        private readonly IMapper mapper;

        public FilterServiceImp(IDynamicRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<SiteGroupModel>> GetSiteGroups(string productId)
        {
            var result = new List<SiteGroupModel>();

            var criteria = new SiteCriteria { ProductId = productId };

            var entities = await repository.FetchMultipleAsync<SiteGroupEntity, LicenseeEntity>(criteria);

            var creditSites = entities.Item2.Where(x => x.GroupId == -1);

            var creditGroup = new SiteGroupModel
            {
                GroupName = "Credit Group",
                ChildItems = mapper.Map<List<LicenseeModel>>(creditSites)
            };


            result.Add(creditGroup);

            var licenseeItems = entities.Item1.Where(x => x.GroupId != -1);
            var licenseeGroups = CreateLicenseeGroup(licenseeItems);
            CreateChildLicensee(licenseeGroups, entities.Item2);

            var depositGroup = new SiteGroupModel
            {
                GroupName = "Licensee Group",
                ChildGroups = licenseeGroups
            };

            result.Add(depositGroup);
            MoveChildItemsToChildGroups(result);

            return result;
        }

        public void MoveChildItemsToChildGroups(List<SiteGroupModel> siteGroups)
        {
            foreach (var item in siteGroups)
            {
                if (item.ChildItems != null && item.ChildItems.Count > 0)
                {
                    var childGroups = mapper.Map<List<SiteGroupModel>>(item.ChildItems);

                    item.ChildGroups ??= new List<SiteGroupModel>();

                    item.ChildGroups.AddRange(childGroups);
                    item.ChildItems.RemoveRange(0, item.ChildItems.Count);
                }

                if (item.ChildGroups != null && item.ChildGroups.Count > 0)
                {
                    MoveChildItemsToChildGroups(item.ChildGroups);
                }
            }
        }

        private void CreateChildLicensee(List<SiteGroupModel> siteGroups, IEnumerable<LicenseeEntity> licenseeEntities)
        {
            foreach (var item in siteGroups)
            {

                var groupLicenseeEntities = licenseeEntities.Where(x => x.GroupId == item.GroupId);
                var groupLicensees = mapper.Map<List<LicenseeModel>>(groupLicenseeEntities);
                item.ChildItems = groupLicensees;

                if (item.ChildGroups != null && item.ChildGroups.Count > 0)
                {
                    CreateChildLicensee(item.ChildGroups, licenseeEntities);
                }
            }
        }

        private List<SiteGroupModel> CreateLicenseeGroup(IEnumerable<SiteGroupEntity> entities)
        {
            var parentItems = entities.Where(x => x.ParentId == 0);
            var result = mapper.Map<List<SiteGroupModel>>(parentItems);
            var childItems = GetChildItems(entities);
            UpdateChildItems(childItems);

            for (int i = 0; i < result.Count; i++)
            {
                for (int j = 0; j < childItems.Count; j++)
                {
                    if (childItems[j].GroupId == result[i].GroupId)
                    {
                        result[i] = childItems[j];
                    }
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
}