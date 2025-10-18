namespace Application.Dtos;

public class PropertyTraceDto
{
    public string IdPropertyTrace { get; set; } = string.Empty;
    public string DateSale { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal Tax { get; set; }
    public string IdProperty { get; set; } = string.Empty;
}

public class PropertyTraceListDto
{
    public List<PropertyTraceDto> Traces { get; set; } = new();
    public int Total { get; set; }
}

public class CreatePropertyTraceDto
{
    public string DateSale { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public decimal Tax { get; set; }
}

public class UpdatePropertyTraceDto
{
    public string? DateSale { get; set; }
    public string? Name { get; set; }
    public decimal? Value { get; set; }
    public decimal? Tax { get; set; }
}

