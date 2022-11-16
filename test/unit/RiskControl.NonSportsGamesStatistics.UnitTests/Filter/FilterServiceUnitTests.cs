using AutoMapper;
using Fanex.Data.Repository;
using NSubstitute;
using RiskControl.NonSportsGamesStatistics.Filter;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Entities;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using RiskControl.UnitTest.Core.xUnit.Asserts.Compare;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace RiskControl.NonSportsGamesStatistics.UnitTests.Filter
{
    public class FilterServiceUnitTests
    {
        private static IEnumerable<SiteGroupEntity> SiteGroupEntityList =>
            new List<SiteGroupEntity>
            {
                new SiteGroupEntity
                {
                    GroupId = -1,
                    GroupName = "Credit Group",
                    ParentId = 0,
                },
                new SiteGroupEntity
                {
                    GroupId = 3,
                    GroupName = "Alek's Group",
                    ParentId = 0,
                }
            };

        private static IEnumerable<LicenseeEntity> LicenseeEntityList =>
            new List<LicenseeEntity>
            {
                new LicenseeEntity
                {
                    GroupId = -1,
                    LicenseeName = "A1game",
                    LicenseeId = -1
                },
                new LicenseeEntity
                {
                    GroupId = -1,
                    LicenseeName = "AJJCV",
                    LicenseeId = -1
                },
                new LicenseeEntity
                {
                    GroupId = 3,
                    LicenseeId = 137,
                    LicenseeName = "Baobet"
                }
            };

        private static List<SiteGroupModel>  ExpectedData =>
            new List<SiteGroupModel>
            {
                new SiteGroupModel
                {
                    ChildGroups = new List<SiteGroupModel>
                    {
                        new SiteGroupModel
                        {
                            ChildGroups = null,
                            ChildItems = null,
                            GroupId = -1,
                            GroupName = null,
                            LicenseeId = -1,
                            LicenseeName = "A1game",
                            ParentId = 0
                        },
                        new SiteGroupModel
                        {
                            ChildGroups = null,
                            ChildItems = null,
                            GroupId = -1,
                            GroupName = null,
                            LicenseeId = -1,
                            LicenseeName = "AJJCV",
                            ParentId = 0
                        }
                    },
                    ChildItems = new(),
                    GroupId = 0,
                    GroupName = "Credit Group",
                    LicenseeId = 0,
                    LicenseeName = null,
                    ParentId = 0
                },
                new SiteGroupModel
                {
                    ChildGroups = new List<SiteGroupModel>
                    {
                        new SiteGroupModel
                        {
                            ChildGroups = new List<SiteGroupModel>
                            { 
                                new SiteGroupModel
                                {
                                    ChildGroups = null,
                                    ChildItems = null,
                                    GroupId = 3,
                                    GroupName = null,
                                    LicenseeId = 137,
                                    LicenseeName = "Baobet",
                                    ParentId = 0
                                }
                            },
                            ChildItems = new(),
                            GroupId = 3,
                            GroupName = "Alek's Group",
                            LicenseeId = 0,
                            LicenseeName = null,
                            ParentId = 0
                        }
                    },
                    ChildItems = null,
                    GroupId = 0,
                    GroupName = "Licensee Group",
                    LicenseeId = 0,
                    LicenseeName = null,
                    ParentId = 0
                }
            };

        private readonly IMapper mapper;

        public FilterServiceUnitTests()
        {
            var mockMapper = new MapperConfiguration(cf =>
            {
                cf.CreateMap<LicenseeEntity, LicenseeModel>();
                cf.CreateMap<LicenseeModel, SiteGroupModel>();
                cf.CreateMap<SiteGroupEntity, SiteGroupModel>();
            });

            mapper = mockMapper.CreateMapper();
        }

        [Fact]
        public async Task GetSiteGroups_HaveProductId_ReturnExpectedData()
        {
            // Arrange
            var productId = "47,59";
            var repository = Substitute.For<IDynamicRepository>();
            repository.FetchMultipleAsync<SiteGroupEntity, LicenseeEntity>(Arg.Compat.Any<SiteCriteria>()).Returns((SiteGroupEntityList, LicenseeEntityList));

            var service = new FilterServiceImp(repository, mapper);

            // Act
            var actualResult = await service.GetSiteGroups(productId);

            // Assert
            DeepAssert.Equal(ExpectedData, actualResult);
        }
    }
}
