using AutoMapper;
using Fanex.Data.Repository;
using Fanex.NAP.Client.Helpers.Web;
using Microsoft.AspNetCore.Mvc;
using RiskControl.NonSportsGamesStatistics.Filter.Criteria;
using RiskControl.NonSportsGamesStatistics.Filter.Model;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RiskControl.NonSportsGamesStatistics.Filter;

[ApiController]
public class UsernameController : ControllerBase
{
    private readonly INapSession session;

    private readonly IDynamicRepository repository;

    private readonly IMapper mapper;

    public UsernameController(INapSession session, IDynamicRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.session = session;
        this.mapper = mapper;
    }

    [Route("state-api/NonSportsGamesStatistics/Filter/UserName/Suggest")]
    [HttpPost]
    public async Task<IEnumerable<string>> Suggest(UsernameSuggestionQueryModel queryModel)
    {
        var criteria = new UsernameSuggestionCriteria
        {
            CustId = session.UserId,
            UserName = queryModel.UserName,
            System = "Accounting",
            IsAllowFISearch = true,
            RoleId = queryModel.RoleId
        };

        return await repository.FetchAsync<string>(criteria).ConfigureAwait(false);
    }

    [Route("api/NonSportsGamesStatistics/Filter/UserName/GetValidUserNames")]
    [HttpPost]
    public async Task<string> GetValidUserNames(UsernameValidationQueryModel queryModel)
    {
        var criteria = mapper.Map<ValidUsernameCriteria>(queryModel);
        var userNames = await repository.FetchAsync<string>(criteria).ConfigureAwait(false);
        return userNames.FirstOrDefault();
    }

    [Route("api/NonSportsGamesStatistics/Filter/UserName/ValidateUsername")]
    [HttpPost]
    public async Task<List<UsernameValidationModel>> ValidateUsername(ValidationUsernameQueryModel queryModel)
    {
        var criteria = mapper.Map<ValidationUsernameCriteria>(queryModel);
        var usernames = await repository.FetchAsync<UsernameValidationModel>(criteria).ConfigureAwait(false);
        return usernames.Where(x => x.IsCust).ToList();
    }
}