using Application.Abstractions;
using Infrastructure.Persistence.Repositories;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Api.DI;

public static class ServiceRegistration
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Add MediatR
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Application.Application).Assembly));
        
        // Add AutoMapper
        services.AddAutoMapper(typeof(Application.Application));
        
        // Add FluentValidation
        services.AddValidatorsFromAssembly(typeof(Application.Application).Assembly);
        
        return services;
    }

    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Add MongoDB
        services.Configure<MongoSettings>(configuration.GetSection("MongoSettings"));
        services.AddSingleton<MongoContext>();
        
        // Add repositories
        services.AddScoped<IPropertyRepository, PropertyRepository>();
        
        return services;
    }
}
