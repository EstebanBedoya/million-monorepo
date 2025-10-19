using Application.Dtos;
using MediatR;

namespace Application.PropertyTraces.Queries;

public record GetPropertyTracesQuery(
    string IdProperty, 
    string? SortBy = "dateSale", 
    string? Order = "desc"
) : IRequest<PropertyTraceListDto>;

