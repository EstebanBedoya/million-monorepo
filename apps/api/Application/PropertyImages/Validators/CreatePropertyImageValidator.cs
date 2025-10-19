using Application.Dtos;
using FluentValidation;

namespace Application.PropertyImages.Validators;

public class CreatePropertyImageValidator : AbstractValidator<CreatePropertyImageDto>
{
    public CreatePropertyImageValidator()
    {
        RuleFor(x => x.File)
            .NotEmpty().WithMessage("File is required")
            .MaximumLength(1000).WithMessage("File URL must not exceed 1000 characters");
    }
}

