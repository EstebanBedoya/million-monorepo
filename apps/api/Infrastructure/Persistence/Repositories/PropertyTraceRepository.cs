using Domain.Entities;
using Domain.Repositories;
using MongoDB.Driver;

namespace Infrastructure.Persistence.Repositories;

public class PropertyTraceRepository : IPropertyTraceRepository
{
    private readonly IMongoCollection<PropertyTrace> _collection;

    public PropertyTraceRepository(MongoDbContext context)
    {
        _collection = context.PropertyTraces;
    }

    public async Task<PropertyTrace?> GetByIdAsync(string idPropertyTrace, CancellationToken cancellationToken = default)
    {
        var filter = Builders<PropertyTrace>.Filter.Eq(pt => pt.IdPropertyTrace, idPropertyTrace);
        return await _collection.Find(filter).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<PropertyTrace>> GetByPropertyIdAsync(
        string idProperty, 
        string? sortBy = "dateSale", 
        string? order = "desc", 
        CancellationToken cancellationToken = default)
    {
        var filter = Builders<PropertyTrace>.Filter.Eq(pt => pt.IdProperty, idProperty);
        
        var sortDefinition = order?.ToLower() == "asc"
            ? Builders<PropertyTrace>.Sort.Ascending(sortBy?.ToLower() == "value" ? pt => pt.Value : pt => pt.DateSale)
            : Builders<PropertyTrace>.Sort.Descending(sortBy?.ToLower() == "value" ? pt => pt.Value : pt => pt.DateSale);

        return await _collection
            .Find(filter)
            .Sort(sortDefinition)
            .ToListAsync(cancellationToken);
    }

    public async Task<PropertyTrace> CreateAsync(PropertyTrace propertyTrace, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(propertyTrace, cancellationToken: cancellationToken);
        return propertyTrace;
    }

    public async Task<PropertyTrace?> UpdateAsync(string idPropertyTrace, PropertyTrace propertyTrace, CancellationToken cancellationToken = default)
    {
        var filter = Builders<PropertyTrace>.Filter.Eq(pt => pt.IdPropertyTrace, idPropertyTrace);
        propertyTrace.IdPropertyTrace = idPropertyTrace;
        
        var result = await _collection.ReplaceOneAsync(filter, propertyTrace, cancellationToken: cancellationToken);
        
        return result.ModifiedCount > 0 ? propertyTrace : null;
    }

    public async Task<bool> DeleteAsync(string idPropertyTrace, CancellationToken cancellationToken = default)
    {
        var filter = Builders<PropertyTrace>.Filter.Eq(pt => pt.IdPropertyTrace, idPropertyTrace);
        var result = await _collection.DeleteOneAsync(filter, cancellationToken);
        return result.DeletedCount > 0;
    }

    public async Task<bool> ExistsAsync(string idPropertyTrace, CancellationToken cancellationToken = default)
    {
        var filter = Builders<PropertyTrace>.Filter.Eq(pt => pt.IdPropertyTrace, idPropertyTrace);
        var count = await _collection.CountDocumentsAsync(filter, cancellationToken: cancellationToken);
        return count > 0;
    }
}

