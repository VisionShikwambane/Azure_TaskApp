using System.Reflection;

namespace DotNet_API.Services
{
    public static class RepositoriesService
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var repositoryTypes = assembly.GetTypes()
                .Where(t => t.Name.EndsWith("Repository") && t.IsClass && !t.IsAbstract)
                .ToList();

            foreach (var type in repositoryTypes)
            {
                services.AddScoped(type);
            }
        }
    }
}
