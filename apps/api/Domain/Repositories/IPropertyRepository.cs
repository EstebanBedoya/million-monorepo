using Domain.Entities;

namespace Domain.Repositories;

public interface IPropertyRepository
{
    Task<Property?> GetByIdAsync(string idProperty, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Property> Properties, int Total)> GetAllAsync(
        int page, 
        int limit, 
        string? search, 
        decimal? minPrice, 
        decimal? maxPrice, 
        CancellationToken cancellationToken = default);
    Task<Property> CreateAsync(Property property, CancellationToken cancellationToken = default);
    Task<Property?> UpdateAsync(string idProperty, Property property, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string idProperty, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string idProperty, CancellationToken cancellationToken = default);
    Task<IEnumerable<Property>> GetByOwnerIdAsync(string idOwner, CancellationToken cancellationToken = default);
}

