using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities;

public class Owner
{
    [BsonId]
    [BsonElement("_id")]
    public string IdOwner { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("photo")]
    public string Photo { get; set; } = string.Empty;

    [BsonElement("birthday")]
    public DateTime Birthday { get; set; }

    public void UpdateInfo(string name, string address, string photo, DateTime birthday)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty");
        
        if (string.IsNullOrWhiteSpace(address))
            throw new ArgumentException("Address cannot be empty");

        Name = name;
        Address = address;
        Photo = photo;
        Birthday = birthday;
    }
}

