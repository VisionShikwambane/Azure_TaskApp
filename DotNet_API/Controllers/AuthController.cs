using DotNet_API.DtoModels;
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
            var (result, token) = await this.authRepository.RegisterAsync(model.Email, model.Password);
            if (result.Succeeded)
            {
                // TODO: Send the token via email (see step 5)
                var confirmationLink = Url.Action(nameof(ConfirmEmail),"Auth",new { email = model.Email, token },Request.Scheme);

                return Ok(new { Message = "User registered successfully. Please check your email to confirm.", ConfirmationLink = confirmationLink });
            }
            return BadRequest(result.Errors);
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
            var token = await this.authRepository.LoginAsync(model.Email, model.Password);
            if (token == null)
            {
                return Unauthorized("Invalid email, password, or email not confirmed");
            }
            return Ok(new { Token = token });
        }


        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var token = await this.authRepository.GeneratePasswordResetTokenAsync(model.Email);
            if (token == null)
            {
                return BadRequest(new { Message = "User not found" });
            }

            var resetLink = Url.Action(nameof(ResetPassword),"Auth",new { email = model.Email, token }, Request.Scheme);

            var emailBody = $"Reset your password by clicking this link: <a href='{resetLink}'>Reset Password</a>";
           /// await _emailService.SendEmailAsync(model.Email, "Password Reset Request", emailBody);

            return Ok(new { Message = "Password reset link sent to your email", ResetLink = resetLink });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var decodedToken = HttpUtility.UrlDecode(model.Token);

            var result = await this.authRepository.ResetPasswordAsync(model.Email, decodedToken, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok(new { Message = "Password reset successfully" });
            }
            return BadRequest(result.Errors);
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
