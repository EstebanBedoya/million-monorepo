using Domain.Entities;
using Domain.Repositories;
using MongoDB.Driver;

namespace Infrastructure.Persistence.Repositories;

public class OwnerRepository : IOwnerRepository
{
    private readonly IMongoCollection<Owner> _collection;

    public OwnerRepository(MongoDbContext context)
    {
        _collection = context.Owners;
    }

    public async Task<Owner?> GetByIdAsync(string idOwner, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Owner>.Filter.Eq(o => o.IdOwner, idOwner);
        return await _collection.Find(filter).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<(IEnumerable<Owner> Owners, int Total)> GetAllAsync(
        int page, 
        int limit, 
        string? search, 
        CancellationToken cancellationToken = default)
    {
        var filterBuilder = Builders<Owner>.Filter;
        var filter = filterBuilder.Empty;

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchFilter = filterBuilder.Or(
                filterBuilder.Regex(o => o.Name, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(o => o.Address, new MongoDB.Bson.BsonRegularExpression(search, "i"))
            );
            filter = filterBuilder.And(filter, searchFilter);
        }

        var total = await _collection.CountDocumentsAsync(filter, cancellationToken: cancellationToken);
        
        var owners = await _collection
            .Find(filter)
            .Skip((page - 1) * limit)
            .Limit(limit)
            .ToListAsync(cancellationToken);

        return (owners, (int)total);
    }

    public async Task<Owner> CreateAsync(Owner owner, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(owner, cancellationToken: cancellationToken);
        return owner;
    }

    public async Task<Owner?> UpdateAsync(string idOwner, Owner owner, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Owner>.Filter.Eq(o => o.IdOwner, idOwner);
        owner.IdOwner = idOwner;
        
        var result = await _collection.ReplaceOneAsync(filter, owner, cancellationToken: cancellationToken);
        
        return result.ModifiedCount > 0 ? owner : null;
    }

    public async Task<bool> DeleteAsync(string idOwner, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Owner>.Filter.Eq(o => o.IdOwner, idOwner);
        var result = await _collection.DeleteOneAsync(filter, cancellationToken);
        return result.DeletedCount > 0;
    }

    public async Task<bool> ExistsAsync(string idOwner, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Owner>.Filter.Eq(o => o.IdOwner, idOwner);
        var count = await _collection.CountDocumentsAsync(filter, cancellationToken: cancellationToken);
        return count > 0;
    }
}

