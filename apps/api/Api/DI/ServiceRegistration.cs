using Application.Mappings;
using Domain.Repositories;
using FluentValidation;
using Infrastructure.Configuration;
using Infrastructure.Mappings;
using Infrastructure.Persistence;
using Infrastructure.Persistence.Repositories;

namespace Api.DI;

public static class ServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        var applicationAssembly = typeof(MappingProfile).Assembly;
        
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(applicationAssembly));
        
        services.AddAutoMapper(applicationAssembly);
        
        services.AddValidatorsFromAssembly(applicationAssembly);
        
        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MongoSettings>(configuration.GetSection("MongoSettings"));
        
        var connectionString = configuration.GetConnectionString("MongoDB");
        if (!string.IsNullOrEmpty(connectionString))
        {
            services.Configure<MongoSettings>(options =>
            {
                options.ConnectionString = connectionString;
            });
        }
        
        MongoMappings.Configure();
        
        services.AddSingleton<MongoDbContext>();
        
        services.AddScoped<IOwnerRepository, OwnerRepository>();
        services.AddScoped<IPropertyRepository, PropertyRepository>();
        services.AddScoped<IPropertyImageRepository, PropertyImageRepository>();
        services.AddScoped<IPropertyTraceRepository, PropertyTraceRepository>();
        
        return services;
    }
}
