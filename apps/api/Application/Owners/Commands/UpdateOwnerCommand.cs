using Application.Dtos;
using MediatR;

namespace Application.Owners.Commands;

public record UpdateOwnerCommand(string IdOwner, UpdateOwnerDto OwnerDto) : IRequest<OwnerDto?>;

