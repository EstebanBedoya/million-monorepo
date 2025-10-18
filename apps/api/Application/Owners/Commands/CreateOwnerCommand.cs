using Application.Dtos;
using MediatR;

namespace Application.Owners.Commands;

public record CreateOwnerCommand(CreateOwnerDto OwnerDto) : IRequest<OwnerDto>;

