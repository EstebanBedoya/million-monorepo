using Domain.Entities;

namespace Domain.Repositories;

public interface IPropertyTraceRepository
{
    Task<PropertyTrace?> GetByIdAsync(string idPropertyTrace, CancellationToken cancellationToken = default);
    Task<IEnumerable<PropertyTrace>> GetByPropertyIdAsync(string idProperty, string? sortBy = "dateSale", string? order = "desc", CancellationToken cancellationToken = default);
    Task<PropertyTrace> CreateAsync(PropertyTrace propertyTrace, CancellationToken cancellationToken = default);
    Task<PropertyTrace?> UpdateAsync(string idPropertyTrace, PropertyTrace propertyTrace, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string idPropertyTrace, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string idPropertyTrace, CancellationToken cancellationToken = default);
}

