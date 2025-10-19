using Application.Dtos;
using MediatR;

namespace Application.Owners.Queries;

public record GetOwnerByIdQuery(string IdOwner) : IRequest<OwnerDto?>;

