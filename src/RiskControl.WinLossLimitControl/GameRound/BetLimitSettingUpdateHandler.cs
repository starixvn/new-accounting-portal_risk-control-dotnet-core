using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Fanex.Data.Repository;
using MediatR;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Request;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.GameRound;

public class BetLimitSettingUpdateHandler : IRequestHandler<BetLimitSettingUpdateRequest, string>
{
    private readonly IDynamicRepository repository;

    private readonly UserHttpContext userHttpContext;

    private readonly IMapper mapper;

    public BetLimitSettingUpdateHandler(IDynamicRepository repository, UserHttpContext userHttpContext, IMapper mapper)
    {
        this.repository = repository;
        this.userHttpContext = userHttpContext;
        this.mapper = mapper;
    }

    public async Task<string> Handle(BetLimitSettingUpdateRequest request, CancellationToken cancellationToken)
    {
        var command = mapper.Map<BetLimitSettingUpdateCommand>(request);
        command.UserId = userHttpContext.UserId;
        command.IP = userHttpContext.IP;
        await repository.ExecuteAsync(command, cancellationToken);

        return string.Empty;
    }
}