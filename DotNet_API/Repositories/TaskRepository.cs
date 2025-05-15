using AutoMapper;
using DotNet_API.DatabaseContext;
using DotNet_API.DataModels;
using Microsoft.AspNetCore.Identity;
using Task = DotNet_API.DataModels.Task;

namespace DotNet_API.Repositories
{
    public class TaskRepository : BaseRepository<Task, TaskDTO>
    {
        public TaskRepository(AppDbContext dbContext, IMapper mapper, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor) : base(dbContext, mapper, userManager, httpContextAccessor)
        {
        }
    }
}
