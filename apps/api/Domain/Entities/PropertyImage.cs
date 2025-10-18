using MongoDB.Bson.Serialization.Attributes;

namespace Domain.Entities;

public class PropertyImage
{
    [BsonId]
    [BsonElement("_id")]
    public string IdPropertyImage { get; set; } = string.Empty;

    [BsonElement("idProperty")]
    public string IdProperty { get; set; } = string.Empty;

    [BsonElement("file")]
    public string File { get; set; } = string.Empty;

    [BsonElement("enabled")]
    public bool Enabled { get; set; } = true;

    public void Enable()
    {
        Enabled = true;
    }

    public void Disable()
    {
        Enabled = false;
    }

    public void UpdateFile(string file)
    {
        if (string.IsNullOrWhiteSpace(file))
            throw new ArgumentException("File cannot be empty");
        
        File = file;
    }
}

