using Application.Dtos;
using MediatR;

namespace Application.PropertyImages.Commands;

public record CreatePropertyImageCommand(string IdProperty, CreatePropertyImageDto ImageDto) : IRequest<PropertyImageDto>;

