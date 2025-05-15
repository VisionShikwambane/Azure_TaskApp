using AutoMapper;
using DotNet_API.DatabaseContext;
using DotNet_API.DataModels;
using DotNet_API.DtoModels;
using Microsoft.AspNetCore.Identity;

namespace DotNet_API.Repositories
{
    public class SettingsRepository : BaseRepository<Settings, SettingsDto>
    {
        public SettingsRepository(AppDbContext dbContext, IMapper mapper, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor) : base(dbContext, mapper, userManager, httpContextAccessor)
        {

        }
    }
}
