using Domain.Entities;
using Domain.Repositories;
using MongoDB.Driver;

namespace Infrastructure.Persistence.Repositories;

public class PropertyRepository : IPropertyRepository
{
    private readonly IMongoCollection<Property> _collection;

    public PropertyRepository(MongoDbContext context)
    {
        _collection = context.Properties;
    }

    public async Task<Property?> GetByIdAsync(string idProperty, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Property>.Filter.Eq(p => p.IdProperty, idProperty);
        return await _collection.Find(filter).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<(IEnumerable<Property> Properties, int Total)> GetAllAsync(
        int page, 
        int limit, 
        string? search, 
        decimal? minPrice, 
        decimal? maxPrice, 
        CancellationToken cancellationToken = default)
    {
        var filterBuilder = Builders<Property>.Filter;
        var filter = filterBuilder.Empty;

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchFilter = filterBuilder.Or(
                filterBuilder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(search, "i")),
                filterBuilder.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(search, "i"))
            );
            filter = filterBuilder.And(filter, searchFilter);
        }

        if (minPrice.HasValue)
        {
            filter = filterBuilder.And(filter, filterBuilder.Gte(p => p.Price, minPrice.Value));
        }

        if (maxPrice.HasValue)
        {
            filter = filterBuilder.And(filter, filterBuilder.Lte(p => p.Price, maxPrice.Value));
        }

        var total = await _collection.CountDocumentsAsync(filter, cancellationToken: cancellationToken);
        
        var properties = await _collection
            .Find(filter)
            .Skip((page - 1) * limit)
            .Limit(limit)
            .ToListAsync(cancellationToken);

        return (properties, (int)total);
    }

    public async Task<Property> CreateAsync(Property property, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(property, cancellationToken: cancellationToken);
        return property;
    }

    public async Task<Property?> UpdateAsync(string idProperty, Property property, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Property>.Filter.Eq(p => p.IdProperty, idProperty);
        property.IdProperty = idProperty;
        
        var result = await _collection.ReplaceOneAsync(filter, property, cancellationToken: cancellationToken);
        
        return result.ModifiedCount > 0 ? property : null;
    }

    public async Task<bool> DeleteAsync(string idProperty, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Property>.Filter.Eq(p => p.IdProperty, idProperty);
        var result = await _collection.DeleteOneAsync(filter, cancellationToken);
        return result.DeletedCount > 0;
    }

    public async Task<bool> ExistsAsync(string idProperty, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Property>.Filter.Eq(p => p.IdProperty, idProperty);
        var count = await _collection.CountDocumentsAsync(filter, cancellationToken: cancellationToken);
        return count > 0;
    }

    public async Task<IEnumerable<Property>> GetByOwnerIdAsync(string idOwner, CancellationToken cancellationToken = default)
    {
        var filter = Builders<Property>.Filter.Eq(p => p.IdOwner, idOwner);
        return await _collection.Find(filter).ToListAsync(cancellationToken);
    }
}

