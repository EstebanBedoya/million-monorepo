using Application.Dtos;
using MediatR;

namespace Application.PropertyImages.Commands;

public record UpdatePropertyImageCommand(string IdPropertyImage, UpdatePropertyImageDto ImageDto) : IRequest<PropertyImageDto?>;

