using AutoMapper;
using DotNet_API.Entities;
using DotNet_API.DTOs;
using Task = DotNet_API.Entities.Task;



namespace DotNet_API.Utilities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Task, TaskDto>();
               




        }
    }
}
