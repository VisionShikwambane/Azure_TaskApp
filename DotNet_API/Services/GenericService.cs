using AutoMapper;
using DotNet_API.Repositories;
using DotNet_API.Utilities;

namespace DotNet_API.Services
{
    public class GenericService<TEntity, TDto> where TEntity : class
    {

        private readonly IGenericRepository<TEntity> _repo;
        private readonly IMapper _mapper;

        public GenericService(IGenericRepository<TEntity> repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TDto>> GetAllAsync() => _mapper.Map<IEnumerable<TDto>>(await _repo.GetAllAsync());

        public async Task<TDto?> GetByIdAsync(int id)
        {
            var entity = await _repo.GetByIdAsync(id);
            return entity == null ? default : _mapper.Map<TDto>(entity);
        }

        public async Task<ResponseObject<TDto>> CreateAsync(TDto dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            await _repo.AddAsync(entity);
            var updatedDto = _mapper.Map<TDto>(entity);
            return new ResponseObject<TDto>(true, "Record saved successfully", updatedDto);
        }

        public async Task<ResponseObject<TDto>> UpdateAsync(int id, TDto dto)
        {
            var entity = _mapper.Map<TEntity>(dto);
            await _repo.UpdateAsync(entity);
            var updatedDto = _mapper.Map<TDto>(entity);
            return new ResponseObject<TDto>(true, "Record updated successfully", updatedDto);
        }

        public async Task<ResponseObject<TDto>> DeleteAsync(int id)
        {
            if (id <= 0)
            {
                return new ResponseObject<TDto>(false, "Invalid ID provided", default!);
            }

            var entity = await _repo.GetByIdAsync(id);
            if (entity == null)
            {
                return new ResponseObject<TDto>(false, $"Record with ID {id} not found", default!);
            }

            await _repo.DeleteAsync(entity);
            return new ResponseObject<TDto>(true, "Record deleted successfully", default!);
        }
    }
}
