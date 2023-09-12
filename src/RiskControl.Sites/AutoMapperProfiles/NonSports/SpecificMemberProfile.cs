using AutoMapper;
using SpecificMemberAssociatedAccount = RiskControl.NonSportsGamesStatistics.SpecificMember.AssociatedAccount;
using SpecificMemberCasinoProduct = RiskControl.NonSportsGamesStatistics.SpecificMember.CasinoProduct;
using SpecificMemberCommon = RiskControl.NonSportsGamesStatistics.SpecificMember.Common;
using SpecificMemberDaily = RiskControl.NonSportsGamesStatistics.SpecificMember.Daily;
using SpecificMemberGrandTotalCasinoProduct = RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.CasinoProduct;
using SpecificMemberGrandTotalDaily = RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.Daily;
using SpecificMemberGrandTotalProduct = RiskControl.NonSportsGamesStatistics.SpecificMember.GrandTotal.Product;
using SpecificMemberMain = RiskControl.NonSportsGamesStatistics.SpecificMember.Username;
using SpecificMemberMonthly = RiskControl.NonSportsGamesStatistics.SpecificMember.Monthly;
using SpecificMemberProduct = RiskControl.NonSportsGamesStatistics.SpecificMember.Product;

namespace RiskControl.Sites.AutoMapperProfiles.NonSports;

public class SpecificMemberProfile : Profile
{
    public SpecificMemberProfile()
    {
        CreateMap<SpecificMemberMain.QueryModel, SpecificMemberCommon.UsernameHistoryCriteria>();
        CreateMap<SpecificMemberCommon.UsernameHistoryCriteria, SpecificMemberCommon.UsernameNormalCriteria>();

        CreateMap<SpecificMemberDaily.QueryModel, SpecificMemberDaily.HistoryCriteria>();
        CreateMap<SpecificMemberDaily.HistoryCriteria, SpecificMemberDaily.NormalCriteria>();

        CreateMap<SpecificMemberAssociatedAccount.QueryModel, SpecificMemberCommon.UsernameHistoryCriteria>();

        CreateMap<SpecificMemberProduct.QueryModel, SpecificMemberProduct.HistoryCriteria>();
        CreateMap<SpecificMemberProduct.HistoryCriteria, SpecificMemberProduct.NormalCriteria>();

        CreateMap<SpecificMemberCasinoProduct.QueryModel, SpecificMemberCasinoProduct.HistoryCriteria>();
        CreateMap<SpecificMemberCasinoProduct.HistoryCriteria, SpecificMemberCasinoProduct.NormalCriteria>();

        CreateMap<SpecificMemberGrandTotalProduct.QueryModel, SpecificMemberGrandTotalProduct.HistoryCriteria>();
        CreateMap<SpecificMemberGrandTotalProduct.HistoryCriteria, SpecificMemberGrandTotalProduct.NormalCriteria>();

        CreateMap<SpecificMemberGrandTotalDaily.QueryModel, SpecificMemberGrandTotalDaily.HistoryCriteria>();
        CreateMap<SpecificMemberGrandTotalDaily.HistoryCriteria, SpecificMemberGrandTotalDaily.NormalCriteria>();

        CreateMap<SpecificMemberGrandTotalCasinoProduct.QueryModel, SpecificMemberGrandTotalCasinoProduct.HistoryCriteria>();
        CreateMap<SpecificMemberGrandTotalCasinoProduct.HistoryCriteria, SpecificMemberGrandTotalCasinoProduct.NormalCriteria>();

        CreateMap<SpecificMemberMonthly.QueryModel, SpecificMemberMonthly.HistoryCriteria>();
        CreateMap<SpecificMemberMonthly.HistoryCriteria, SpecificMemberMonthly.NormalCriteria>();
    }
}