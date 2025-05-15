using AutoMapper;
using DotNet_API.DatabaseContext;
using DotNet_API.DataModels;
using Microsoft.AspNetCore.Identity;

namespace DotNet_API.Repositories
{
    public class ClientRepository : BaseRepository<Client, Client>
    {
        public ClientRepository(AppDbContext dbContext, IMapper mapper, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor) : base(dbContext, mapper, userManager, httpContextAccessor)
        {
        }
    }
}
