using AutoMapper;
using DotNet_API.DataModels;
using Task = DotNet_API.DataModels.Task;


namespace DotNet_API.Utilities
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Task, TaskDTO>();
               




        }
    }
}
