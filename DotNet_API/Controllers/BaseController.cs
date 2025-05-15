using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.AspNetCore.OData.Query;
using DotNet_API.DatabaseContext;
using AutoMapper;
using DotNet_API.Repositories;
using DotNet_API.DataModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;

namespace DotNet_API.Controllers
{
  
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController<IRepository, T, TDTO> : ODataController where IRepository : class, IBaseRepository<T, TDTO> where T : class
    {

      
        protected readonly IRepository repository;
        private readonly UserManager<AppUser> userManager;
        private readonly IMapper mapper;
        private readonly AppDbContext dbContext;
        private readonly IHttpContextAccessor httpContextAccessor;

        public BaseController(AppDbContext dbContext, IMapper mapper, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor )
        {
          
            this.userManager = userManager;
            this.mapper = mapper;
            this.dbContext = dbContext;
            this.httpContextAccessor = httpContextAccessor;
            this.repository = (IRepository)Activator.CreateInstance(typeof(IRepository), dbContext, mapper, userManager, httpContextAccessor)!;
           
        }


        [EnableQuery]
        [HttpGet]
        public virtual async Task<IEnumerable<TDTO>> Get()
        {
            return await repository.GetAll();
        }

        [EnableQuery]
        [HttpGet("{key}")]
        public virtual async Task<TDTO> Get(int key)
        {
            var response = await repository.GetById(key);
            return response;
        }

        [HttpPost]
        public virtual async Task<IActionResult> Post([FromBody] TDTO dto)
        {
            try
            {
                var response = await repository.Add(dto);
                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the error message here (e.g., using a logging framework like Serilog)
                Console.WriteLine($"Error: {ex.Message}");

                // Return the error details in the response (useful for debugging)
                return StatusCode(500, new { message = "An error occurred", details = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        public virtual async Task<IActionResult> Delete(int id)
        {
            var response = await repository.Delete(id);
            return Ok(response);
        }


        [HttpPost("SaveRange")]
        public virtual async Task<IActionResult> SaveRange([FromBody] IEnumerable<TDTO> dtos)
        {
            var response = await repository.AddRange(dtos);
            return Ok(response);
        }


        [HttpDelete("DeleteRange")]
        public virtual async Task<IActionResult> DeleteRange([FromBody] IEnumerable<int> ids)
        {
            var response = await repository.DeleteRange(ids);
            return Ok(response);
        }

    }
}
