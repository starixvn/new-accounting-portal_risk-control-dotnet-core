using AutoMapper;
using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;
using System.Threading.Tasks;
using System.Threading;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock
{
    public class HandlerUnblockPlaceBet : IRequestHandler<RequestUnblockPlaceBet, ExecuteResult>
    {
        private readonly StateService stateService;

        private readonly UnblockMemberService unblockMemberService;

        public HandlerUnblockPlaceBet(StateService stateService, UnblockMemberService unblockMemberService)
        {
            this.unblockMemberService = unblockMemberService;
            this.stateService = stateService;
        }

        public async Task<ExecuteResult> Handle(RequestUnblockPlaceBet request, CancellationToken cancellationToken)
        {
            var parameter = Mapper.Map<ServiceParameter>(request);
            parameter.UserId = stateService.UserId;
            parameter.IP = stateService.IP;

            await unblockMemberService.UnblockPlaceBet(parameter).ConfigureAwait(false);

            return new ExecuteResult();
        }
    }
}