using Application.Dtos;
using MediatR;

namespace Application.Properties.Commands;

public record CreatePropertyCommand(CreatePropertyDto PropertyDto) : IRequest<PropertyDto>;

