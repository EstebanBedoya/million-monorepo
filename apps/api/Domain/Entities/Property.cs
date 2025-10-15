namespace Domain.Entities;

public class Property
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Currency { get; set; } = "USD";
    public Location Location { get; set; } = new();
    public PropertyType PropertyType { get; set; }
    public int? Bedrooms { get; set; }
    public int? Bathrooms { get; set; }
    public decimal Area { get; set; }
    public AreaUnit AreaUnit { get; set; } = AreaUnit.SquareMeters;
    public List<string> Features { get; set; } = new();
    public List<string> Images { get; set; } = new();
    public PropertyStatus Status { get; set; } = PropertyStatus.Available;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public void UpdatePrice(decimal newPrice)
    {
        if (newPrice <= 0)
            throw new ArgumentException("Price must be greater than zero");
            
        Price = newPrice;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsSold()
    {
        Status = PropertyStatus.Sold;
        UpdatedAt = DateTime.UtcNow;
    }

    public void MarkAsRented()
    {
        Status = PropertyStatus.Rented;
        UpdatedAt = DateTime.UtcNow;
    }
}

public class Location
{
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public Coordinates? Coordinates { get; set; }
}

public class Coordinates
{
    public double Lat { get; set; }
    public double Lng { get; set; }
}

public enum PropertyType
{
    Apartment,
    House,
    Commercial,
    Land
}

public enum AreaUnit
{
    SquareMeters,
    SquareFeet
}

public enum PropertyStatus
{
    Available,
    Sold,
    Rented
}
