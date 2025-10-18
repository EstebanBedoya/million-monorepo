using Application.Dtos;
using MediatR;

namespace Application.PropertyImages.Queries;

public record GetPropertyImagesQuery(string IdProperty, bool? EnabledOnly = null) : IRequest<PropertyImageListDto>;

