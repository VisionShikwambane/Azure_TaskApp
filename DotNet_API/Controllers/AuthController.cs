
using DotNet_API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Web;

namespace DotNet_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthRepository authRepository;

        public AuthController(AuthRepository authRepository)
        {
            this.authRepository = authRepository;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var result = await this.authRepository.RegisterAsync(model.Email, model.Password);

            if (!result.IsSuccess)
            {
                return BadRequest(new { result.Message, result.Errors });
            }

            var confirmationLink = Url.Action(
                nameof(ConfirmEmail),
                "Auth",
                new { email = model.Email, token = result.Data },
                Request.Scheme
            );

            return Ok(new
            {
                result.Message,
                ConfirmationLink = confirmationLink
            });
        }



        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string email, string token)
        {
            var result = await this.authRepository.ConfirmEmailAsync(email, token);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Email confirmed successfully" });
            }
            return BadRequest(result.Errors);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var result = await authRepository.LoginAsync(model.Email, model.Password);

            if (!result.IsSuccess)
            {
                return Unauthorized(result);
            }

            return Ok(result);
        }



        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var result = await authRepository.GeneratePasswordResetTokenAsync(model.Email);

            if (!result.IsSuccess)
            {
                return BadRequest(new { result.Message });
            }

            var resetLink = Url.Action(nameof(ResetPassword), "Auth", new { email = model.Email, token = result.Data }, Request.Scheme);

            var emailBody = $"Reset your password by clicking this link: <a href='{resetLink}'>Reset Password</a>";
            // await _emailService.SendEmailAsync(model.Email, "Password Reset Request", emailBody);

            return Ok(new
            {
                result.Message,
                ResetLink = resetLink
            });
        }


        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var decodedToken = HttpUtility.UrlDecode(model.Token);
            var result = await this.authRepository.ResetPasswordAsync(model.Email, decodedToken, model.NewPassword);

            if (!result.IsSuccess)
            {
                return BadRequest(new { result.Message, result.Errors });
            }

            return Ok(new { result.Message });
        }




    }



    public class RegisterModel
    {
        public string Email { get; set; }  = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
    }

    public class LoginModel
    {
        public string Email { get; set; }  = string.Empty ;
        public string Password { get; set; } = string.Empty;
    }

   
    public class ForgotPasswordModel
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordModel
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
