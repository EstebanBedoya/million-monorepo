using Application.Dtos;
using FluentValidation;

namespace Application.Owners.Validators;

public class CreateOwnerValidator : AbstractValidator<CreateOwnerDto>
{
    public CreateOwnerValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(500).WithMessage("Address must not exceed 500 characters");

        RuleFor(x => x.Birthday)
            .NotEmpty().WithMessage("Birthday is required")
            .Must(BeAValidDate).WithMessage("Birthday must be a valid date in format yyyy-MM-dd");
    }

    private bool BeAValidDate(string dateString)
    {
        return DateTime.TryParse(dateString, out _);
    }
}

