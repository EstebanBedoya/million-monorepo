using Application.Dtos;
using MediatR;

namespace Application.Properties.Queries;

public record GetPropertyByIdQuery(string IdProperty) : IRequest<PropertyDetailDto?>;

