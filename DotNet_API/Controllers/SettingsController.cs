using AutoMapper;
using DotNet_API.DatabaseContext;
using DotNet_API.DataModels;
using DotNet_API.DtoModels;
using DotNet_API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace DotNet_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : BaseController<SettingsRepository, Settings, SettingsDto>
    {
        public SettingsController(AppDbContext dbContext, IMapper mapper, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor) : base(dbContext, mapper, userManager, httpContextAccessor)
        {

        }
    }
}
