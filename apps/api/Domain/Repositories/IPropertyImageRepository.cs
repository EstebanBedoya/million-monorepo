using Domain.Entities;

namespace Domain.Repositories;

public interface IPropertyImageRepository
{
    Task<PropertyImage?> GetByIdAsync(string idPropertyImage, CancellationToken cancellationToken = default);
    Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(string idProperty, bool? enabledOnly = null, CancellationToken cancellationToken = default);
    Task<PropertyImage> CreateAsync(PropertyImage propertyImage, CancellationToken cancellationToken = default);
    Task<PropertyImage?> UpdateAsync(string idPropertyImage, PropertyImage propertyImage, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string idPropertyImage, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string idPropertyImage, CancellationToken cancellationToken = default);
}

