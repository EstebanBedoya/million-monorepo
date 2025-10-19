using Application.Dtos;
using MediatR;

namespace Application.Properties.Commands;

public record UpdatePropertyCommand(string IdProperty, UpdatePropertyDto PropertyDto) : IRequest<PropertyDto?>;

