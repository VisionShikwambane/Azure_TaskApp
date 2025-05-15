using AutoMapper;
using DotNet_API.DatabaseContext;
using DotNet_API.DataModels;
using DotNet_API.Utilities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Security.Claims;

namespace DotNet_API.Repositories
{

    public interface IBaseRepository<T, TDTO> where T : class
    {
        Task<IEnumerable<TDTO>> GetAll();
        Task<TDTO> GetById(long Id);
        Task<ResponseObject<IEnumerable<TDTO>>> AddRange(IEnumerable<TDTO> dtos);
        Task<ResponseObject<TDTO>> Add(TDTO dto);
        Task<ResponseObject<bool>> Delete(int id);

        Task<ResponseObject<bool>> DeleteRange(IEnumerable<int> ids);


    }


    public class BaseRepository<T, TDTO> : IBaseRepository<T, TDTO> where T : class
    {
        protected readonly AppDbContext dbContext;
        protected readonly IMapper mapper;
        private readonly UserManager<AppUser> userManager;
        protected readonly IHttpContextAccessor httpContextAccessor;

        public BaseRepository(AppDbContext dbContext, IMapper mapper, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            this.dbContext = dbContext;
            this.mapper = mapper;
            this.userManager = userManager;
            this.httpContextAccessor = httpContextAccessor;
        }


        protected async Task<AppUser> GetCurrentUser()
        {
            var principal = httpContextAccessor.HttpContext?.User;
            if (principal == null || !principal.Identity.IsAuthenticated)
            {
                return null; // No user authenticated
            }

            var user = await userManager.GetUserAsync(principal);
            return user;
        }
        public virtual async Task<IEnumerable<TDTO>> GetAll()
        {
            try
            {
                var entities = await dbContext.Set<T>().ToListAsync();
                return mapper.Map<IEnumerable<TDTO>>(entities);
            }

            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                throw new Exception("An unexpected error occurred.", ex);
            }
        }

        public virtual async Task<TDTO> GetById(long id)
        {
            try
            {
                var entity = await dbContext.Set<T>().FindAsync(id);

                if (entity == null)
                {
                    throw new Exception("Record not found!");
                }

                return mapper.Map<TDTO>(entity);
            }

            catch (Exception ex)
            {

                Console.WriteLine($"Exception: {ex.Message}");
                throw new Exception("An unexpected error occurred. Please try again.", ex);
            }
        }




        public virtual async Task<ResponseObject<TDTO>> Add(TDTO dto)
        {
            try
            {
                var entity = mapper.Map<T>(dto);
                var validationResult = IsValidated(entity, dto);

                if (!validationResult.IsValid)
                {
                    return new ResponseObject<TDTO>(false, validationResult.Message, dto);
                }


                dbContext.Set<T>().Update(entity);
                await dbContext.SaveChangesAsync();
                dbContext.Entry(entity).State = EntityState.Detached;
                var updatedDto = mapper.Map<TDTO>(entity);
                return new ResponseObject<TDTO>(true, "Record saved successfully", updatedDto);

            }
            catch (Exception ex)
            {
                return new ResponseObject<TDTO>(false, $"Error adding entity: {ex.Message}");
            }
        }



        public virtual async Task UpdateAsync(T entity)
        {

            this.dbContext.Set<T>().Update(entity);
            await this.dbContext.SaveChangesAsync();
            this.dbContext.Entry(entity).State = EntityState.Detached;
        }



        public virtual async Task<ResponseObject<IEnumerable<TDTO>>> AddRange(IEnumerable<TDTO> dtos)
        {
            try
            {
                var entities = mapper.Map<IEnumerable<T>>(dtos);
                foreach (var entity in entities)
                {
                    var validationResult = IsValidated(entity, mapper.Map<TDTO>(entity));
                    if (!validationResult.IsValid)
                    {
                        return new ResponseObject<IEnumerable<TDTO>>(false, validationResult.Message);
                    }
                    dbContext.Set<T>().Update(entity);
                    await dbContext.SaveChangesAsync();
                    dbContext.Entry(entity).State = EntityState.Detached;
                }


                return new ResponseObject<IEnumerable<TDTO>>(true, "Records saved successfully", dtos);
            }

            catch (Exception ex)
            {
                return new ResponseObject<IEnumerable<TDTO>>(false, $"Error adding Records: {ex.Message}");
            }
        }

        public virtual async Task<ResponseObject<bool>> Delete(int id)
        {
            try
            {

                var entity = await dbContext.Set<T>().FindAsync(id);
                if (entity == null)
                {
                    return new ResponseObject<bool>(false, "Record not found", false);
                }
                dbContext.Set<T>().Remove(entity);
                await dbContext.SaveChangesAsync();
                return new ResponseObject<bool>(true, "Record deleted successfully", true);
            }
            catch (Exception ex)
            {
                return new ResponseObject<bool>(false, $"Error deleting entity: {ex.Message}", false);
            }
        }




        public virtual async Task<ResponseObject<bool>> DeleteRange(IEnumerable<int> ids)
        {
            try
            {
                foreach (var id in ids)
                {
                    var entity = await dbContext.Set<T>().FindAsync(id);

                    if (entity == null)
                    {
                        return new ResponseObject<bool>(false, $"Record with ID {id} not found", false);
                    }

                    dbContext.Set<T>().Remove(entity);
                    await dbContext.SaveChangesAsync();
                }
                return new ResponseObject<bool>(true, "Records deleted successfully", true);
            }
            catch (Exception ex)
            {
                return new ResponseObject<bool>(false, $"Error deleting entities: {ex.Message}", false);
            }
        }



        public virtual ValidationResults IsValidated(T entity, TDTO entityDTO)
        {
            return new ValidationResults(true, "Validation successful");
        }




    }

}
