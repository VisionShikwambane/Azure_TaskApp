using AutoMapper;
using DotNet_API.DatabaseContext;
using DotNet_API.DataModels;
using DotNet_API.DtoModels;
using DotNet_API.Utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DotNet_API.Repositories
{
    public class InvoiceRepository : BaseRepository<Invoice, InvoiceDto>
    {
        public InvoiceRepository(AppDbContext dbContext, IMapper mapper, UserManager<AppUser> userManager, IHttpContextAccessor httpContextAccessor) : base(dbContext, mapper, userManager, httpContextAccessor)
        {
        }

        

        public override async Task<IEnumerable<InvoiceDto>> GetAll()
        {
            try
            {
                var entities = await dbContext.Invoices
                    .Include(c => c.Items)
                    .Include(e=>e.Client)
                    .Include(e=>e.InvoiceTemplate)
                    .ToListAsync();

                var carDtos = mapper.Map<IEnumerable<InvoiceDto>>(entities);
                    
                return carDtos;
            }

            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                throw new Exception("An unexpected error occurred.", ex);
            }
        }

        public async override Task<ResponseObject<InvoiceDto>> Add(InvoiceDto dto)
        {
            try
            {
                var entity = mapper.Map<Invoice>(dto);
                var validationResult = IsValidated(entity, dto);

                if (!validationResult.IsValid)
                {
                    return new ResponseObject<InvoiceDto>(false, validationResult.Message, dto);
                }

                var currentUser = await GetCurrentUser();
                if (currentUser == null)
                {
                    return new ResponseObject<InvoiceDto>(false, "No authenticated user found", dto);
                }

                dbContext.Set<Invoice>().Update(entity);
                await dbContext.SaveChangesAsync();
                dbContext.Entry(entity).State = EntityState.Detached;
                var updatedDto = mapper.Map<InvoiceDto>(entity);
                return new ResponseObject<InvoiceDto>(true, "Record saved successfully", updatedDto);

            }
            catch (Exception ex)
            {
                return new ResponseObject<InvoiceDto>(false, $"Error adding entity: {ex.Message}");
            }
        }










    }
}
