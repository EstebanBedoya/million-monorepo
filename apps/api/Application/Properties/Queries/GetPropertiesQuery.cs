using Application.Dtos;
using MediatR;

namespace Application.Properties.Queries;

public record GetPropertiesQuery(
    int Page = 1,
    int Limit = 10,
    string? Search = null,
    decimal? MinPrice = null,
    decimal? MaxPrice = null
) : IRequest<PropertyListDto>;

