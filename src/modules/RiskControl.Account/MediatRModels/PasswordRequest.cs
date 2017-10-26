using MediatR;
using System.ComponentModel.DataAnnotations;

namespace RiskControl.Account.MediatRModels
{
    public class PasswordRequest : IRequest<bool>
    {
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string OldPassword { get; set; }

        [Compare("Password")]
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string ConfirmPassword { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string Password { get; set; }
    }
}
