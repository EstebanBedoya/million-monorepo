namespace Application.Dtos;

public class PropertyDto
{
    public string IdProperty { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CodeInternal { get; set; } = string.Empty;
    public int Year { get; set; }
    public string IdOwner { get; set; } = string.Empty;
    public string? Image { get; set; }
}

public class PropertyDetailDto : PropertyDto
{
    public OwnerDto? Owner { get; set; }
    public List<PropertyImageDto>? Images { get; set; }
    public List<PropertyTraceDto>? Traces { get; set; }
}

public class PropertyListDto
{
    public List<PropertyDto> Properties { get; set; } = new();
    public PaginationDto Pagination { get; set; } = new();
}

public class CreatePropertyDto
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string CodeInternal { get; set; } = string.Empty;
    public int Year { get; set; }
    public string IdOwner { get; set; } = string.Empty;
}

public class UpdatePropertyDto
{
    public string? Name { get; set; }
    public string? Address { get; set; }
    public decimal? Price { get; set; }
    public string? CodeInternal { get; set; }
    public int? Year { get; set; }
    public string? IdOwner { get; set; }
}

