namespace Application.Dtos;

public class PropertyImageDto
{
    public string IdPropertyImage { get; set; } = string.Empty;
    public string IdProperty { get; set; } = string.Empty;
    public string File { get; set; } = string.Empty;
    public bool Enabled { get; set; }
}

public class PropertyImageListDto
{
    public List<PropertyImageDto> Images { get; set; } = new();
    public int Total { get; set; }
}

public class CreatePropertyImageDto
{
    public string File { get; set; } = string.Empty;
    public bool? Enabled { get; set; }
}

public class UpdatePropertyImageDto
{
    public string? File { get; set; }
    public bool? Enabled { get; set; }
}

