using System.Reflection;

namespace DotNet_API.Services
{
    public static class ServicesService
    {
        public static void AddServices(this IServiceCollection services)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var repositoryTypes = assembly.GetTypes()
                .Where(t => t.Name.EndsWith("Service") && t.IsClass && !t.IsAbstract)
                .ToList();

            foreach (var type in repositoryTypes)
            {
                services.AddScoped(type);
            }
        }
    }
}
