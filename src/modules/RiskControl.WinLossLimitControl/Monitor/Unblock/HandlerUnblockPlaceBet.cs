using AutoMapper;
using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock
{
    public class HandlerUnblockPlaceBet : IAsyncRequestHandler<RequestUnblockPlaceBet, ExecuteResult>
    {
        private readonly StateService stateService;

        private readonly UnblockMemberService unblockMemberService;

        public HandlerUnblockPlaceBet(StateService stateService, UnblockMemberService unblockMemberService)
        {
            this.unblockMemberService = unblockMemberService;
            this.stateService = stateService;
        }

        public async Task<ExecuteResult> Handle(RequestUnblockPlaceBet message)
        {
            var parameter = Mapper.Map<ServiceParameter>(message);
            parameter.UserId = stateService.UserId;
            parameter.IP = stateService.IP;

            await unblockMemberService.UnblockPlaceBet(parameter).ConfigureAwait(false);

            return new ExecuteResult();
        }
    }
}