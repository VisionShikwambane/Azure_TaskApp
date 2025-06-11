using DotNet_API.DataModels;
using DotNet_API.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DotNet_API.Repositories
{
    public class AuthRepository
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly IConfiguration configuration;


        public AuthRepository(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.signInManager = signInManager!;
            this.configuration = configuration!;
        }


        // Register a new user and return a confirmation token
        public async Task<ResponseObject<string>> RegisterAsync(string email, string password)
        {
            var user = new AppUser
            {
                UserName = email,
                Email = email,
            };

            var result = await userManager.CreateAsync(user, password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ResponseObject<string>.Fail("User registration failed", errors);
            }

            await userManager.AddToRoleAsync(user, "User");
            var token = await userManager.GenerateEmailConfirmationTokenAsync(user);

            return ResponseObject<string>.Success("User registered successfully", token);
        }



        public async Task<IdentityResult> ConfirmEmailAsync(string email, string token)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "User not found" });
            }

            return await userManager.ConfirmEmailAsync(user, token);
        }



        public async Task<ResponseObject<string>> LoginAsync(string email, string password)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null || !await userManager.CheckPasswordAsync(user, password))
            {
                return ResponseObject<string>.Fail("Invalid email or password");
            }

            if (!await userManager.IsEmailConfirmedAsync(user))
            {
                return ResponseObject<string>.Fail("Email not confirmed");
            }

            var userRoles = await userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
        new Claim(ClaimTypes.Name, user.UserName),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
             };


            foreach (var role in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityTokenHandler().WriteToken(GenerateJwtToken(authClaims));
            return ResponseObject<string>.Success("Login successful", token);
        }

        public async Task<ResponseObject<string>> GeneratePasswordResetTokenAsync(string email)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return ResponseObject<string>.Fail("User not found");
            }

            var token = await userManager.GeneratePasswordResetTokenAsync(user);
            return ResponseObject<string>.Success("Password reset token generated", token);
        }


        // Reset password using the token
        public async Task<ResponseObject<bool>> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return ResponseObject<bool>.Fail("User not found");
            }

            var result = await userManager.ResetPasswordAsync(user, token, newPassword);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return ResponseObject<bool>.Fail("Password reset failed", errors);
            }

            return ResponseObject<bool>.Success("Password reset successfully", true);
        }



        private JwtSecurityToken GenerateJwtToken(List<Claim> authClaims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                expires: DateTime.UtcNow.AddHours(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );
            return token;
        }
    }
}
