using AutoMapper;
using DotNet_API.DatabaseContext;
using DotNet_API.DataModels;
using DotNet_API.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Task = DotNet_API.DataModels.Task;

namespace DotNet_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : BaseController<TaskRepository, Task, TaskDTO>
    {
        public TaskController(AppDbContext dbContext, IMapper mapper, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor) : base(dbContext, mapper, userManager, httpContextAccessor)
        {
        }
    }
}
