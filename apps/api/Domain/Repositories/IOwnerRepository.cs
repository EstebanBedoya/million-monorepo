using Domain.Entities;

namespace Domain.Repositories;

public interface IOwnerRepository
{
    Task<Owner?> GetByIdAsync(string idOwner, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Owner> Owners, int Total)> GetAllAsync(int page, int limit, string? search, CancellationToken cancellationToken = default);
    Task<Owner> CreateAsync(Owner owner, CancellationToken cancellationToken = default);
    Task<Owner?> UpdateAsync(string idOwner, Owner owner, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(string idOwner, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(string idOwner, CancellationToken cancellationToken = default);
}

