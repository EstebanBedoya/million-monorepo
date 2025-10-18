using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities;

public class Property
{
    [BsonId]
    [BsonElement("_id")]
    public string IdProperty { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("price")]
    public decimal Price { get; set; }

    [BsonElement("codeInternal")]
    public string CodeInternal { get; set; } = string.Empty;

    [BsonElement("year")]
    public int Year { get; set; }

    [BsonElement("idOwner")]
    public string IdOwner { get; set; } = string.Empty;

    public void UpdatePrice(decimal newPrice)
    {
        if (newPrice <= 0)
            throw new ArgumentException("Price must be greater than zero");
            
        Price = newPrice;
    }

    public void UpdateInfo(string name, string address, decimal price, string codeInternal, int year, string idOwner)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty");
        
        if (string.IsNullOrWhiteSpace(address))
            throw new ArgumentException("Address cannot be empty");
        
        if (price <= 0)
            throw new ArgumentException("Price must be greater than zero");
        
        if (string.IsNullOrWhiteSpace(codeInternal))
            throw new ArgumentException("CodeInternal cannot be empty");
        
        if (year < 1800 || year > DateTime.UtcNow.Year + 10)
            throw new ArgumentException("Year must be valid");
        
        if (string.IsNullOrWhiteSpace(idOwner))
            throw new ArgumentException("IdOwner cannot be empty");

        Name = name;
        Address = address;
        Price = price;
        CodeInternal = codeInternal;
        Year = year;
        IdOwner = idOwner;
    }
}
