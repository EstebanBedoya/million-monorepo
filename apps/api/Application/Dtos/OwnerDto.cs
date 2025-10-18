namespace Application.Dtos;

public class OwnerDto
{
    public string IdOwner { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Photo { get; set; } = string.Empty;
    public string Birthday { get; set; } = string.Empty;
}

public class OwnerListDto
{
    public List<OwnerDto> Owners { get; set; } = new();
    public PaginationDto Pagination { get; set; } = new();
}

public class CreateOwnerDto
{
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Photo { get; set; }
    public string Birthday { get; set; } = string.Empty;
}

public class UpdateOwnerDto
{
    public string? Name { get; set; }
    public string? Address { get; set; }
    public string? Photo { get; set; }
    public string? Birthday { get; set; }
}

