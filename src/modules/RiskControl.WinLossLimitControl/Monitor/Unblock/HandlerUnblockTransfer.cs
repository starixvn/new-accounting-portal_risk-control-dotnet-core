using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Olympus.DotNetCore.Authentication;
using RiskControl.WinLossLimitControl.Models;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.Monitor.Unblock
{
    public class HandlerUnblockTransfer : IAsyncRequestHandler<RequestUnblockTransfer, ExecuteResult>
    {
        private readonly StateService stateService;

        private readonly UnblockMemberService unblockMemberService;

        public HandlerUnblockTransfer(StateService stateService, UnblockMemberService unblockMemberService)
        {
            this.unblockMemberService = unblockMemberService;
            this.stateService = stateService;
        }

        public async Task<ExecuteResult> Handle(RequestUnblockTransfer message)
        {
            var parameter = Mapper.Map<ServiceParameter>(message);
            parameter.UserId = stateService.UserId;
            parameter.IP = stateService.IP;

            await unblockMemberService.UnblockTransfer(parameter).ConfigureAwait(false);
            return new ExecuteResult();
        }
    }
}