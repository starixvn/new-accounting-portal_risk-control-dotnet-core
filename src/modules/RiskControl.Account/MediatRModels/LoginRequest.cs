using System.ComponentModel.DataAnnotations;
using MediatR;

namespace RiskControl.Account.MediatRModels {
    public class LoginRequest : IRequest<LoginResponse> {
        [Required]
        [StringLength (50, MinimumLength = 2)]
        public string Username { get; set; }

        [Required]
        [StringLength (50, MinimumLength = 2)]
        public string Password { get; set; }

        public string MaintenanceToken { get; set; }
    }
}