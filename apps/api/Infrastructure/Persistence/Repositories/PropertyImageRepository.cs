using Domain.Entities;
using Domain.Repositories;
using MongoDB.Driver;

namespace Infrastructure.Persistence.Repositories;

public class PropertyImageRepository : IPropertyImageRepository
{
    private readonly IMongoCollection<PropertyImage> _collection;

    public PropertyImageRepository(MongoDbContext context)
    {
        _collection = context.PropertyImages;
    }

    public async Task<PropertyImage?> GetByIdAsync(string idPropertyImage, CancellationToken cancellationToken = default)
    {
        var filter = Builders<PropertyImage>.Filter.Eq(pi => pi.IdPropertyImage, idPropertyImage);
        return await _collection.Find(filter).FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(
        string idProperty, 
        bool? enabledOnly = null, 
        CancellationToken cancellationToken = default)
    {
        var filterBuilder = Builders<PropertyImage>.Filter;
        var filter = filterBuilder.Eq(pi => pi.IdProperty, idProperty);

        if (enabledOnly.HasValue && enabledOnly.Value)
        {
            filter = filterBuilder.And(filter, filterBuilder.Eq(pi => pi.Enabled, true));
        }

        return await _collection.Find(filter).ToListAsync(cancellationToken);
    }

    public async Task<PropertyImage> CreateAsync(PropertyImage propertyImage, CancellationToken cancellationToken = default)
    {
        await _collection.InsertOneAsync(propertyImage, cancellationToken: cancellationToken);
        return propertyImage;
    }

    public async Task<PropertyImage?> UpdateAsync(string idPropertyImage, PropertyImage propertyImage, CancellationToken cancellationToken = default)
    {
        var filter = Builders<PropertyImage>.Filter.Eq(pi => pi.IdPropertyImage, idPropertyImage);
        propertyImage.IdPropertyImage = idPropertyImage;
        
        var result = await _collection.ReplaceOneAsync(filter, propertyImage, cancellationToken: cancellationToken);
        
        return result.ModifiedCount > 0 ? propertyImage : null;
    }

    public async Task<bool> DeleteAsync(string idPropertyImage, CancellationToken cancellationToken = default)
    {
        var filter = Builders<PropertyImage>.Filter.Eq(pi => pi.IdPropertyImage, idPropertyImage);
        var result = await _collection.DeleteOneAsync(filter, cancellationToken);
        return result.DeletedCount > 0;
    }

    public async Task<bool> ExistsAsync(string idPropertyImage, CancellationToken cancellationToken = default)
    {
        var filter = Builders<PropertyImage>.Filter.Eq(pi => pi.IdPropertyImage, idPropertyImage);
        var count = await _collection.CountDocumentsAsync(filter, cancellationToken: cancellationToken);
        return count > 0;
    }
}

