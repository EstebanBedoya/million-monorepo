using Application.Dtos;
using FluentValidation;

namespace Application.Properties.Validators;

public class CreatePropertyValidator : AbstractValidator<CreatePropertyDto>
{
    public CreatePropertyValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than zero");

        RuleFor(x => x.CodeInternal)
            .NotEmpty().WithMessage("CodeInternal is required")
            .MaximumLength(50).WithMessage("CodeInternal must not exceed 50 characters");

        RuleFor(x => x.Year)
            .InclusiveBetween(1800, DateTime.UtcNow.Year + 10)
            .WithMessage($"Year must be between 1800 and {DateTime.UtcNow.Year + 10}");

        RuleFor(x => x.IdOwner)
            .NotEmpty().WithMessage("IdOwner is required");
    }
}

