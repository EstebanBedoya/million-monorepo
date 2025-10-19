using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities;

public class PropertyTrace
{
    [BsonId]
    [BsonElement("_id")]
    public string IdPropertyTrace { get; set; } = string.Empty;

    [BsonElement("dateSale")]
    public DateTime DateSale { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("value")]
    public decimal Value { get; set; }

    [BsonElement("tax")]
    public decimal Tax { get; set; }

    [BsonElement("idProperty")]
    public string IdProperty { get; set; } = string.Empty;

    public void UpdateInfo(DateTime dateSale, string name, decimal value, decimal tax)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty");
        
        if (value < 0)
            throw new ArgumentException("Value cannot be negative");
        
        if (tax < 0)
            throw new ArgumentException("Tax cannot be negative");

        DateSale = dateSale;
        Name = name;
        Value = value;
        Tax = tax;
    }
}

