using Application.Dtos;
using FluentValidation;

namespace Application.PropertyTraces.Validators;

public class CreatePropertyTraceValidator : AbstractValidator<CreatePropertyTraceDto>
{
    public CreatePropertyTraceValidator()
    {
        RuleFor(x => x.DateSale)
            .NotEmpty().WithMessage("DateSale is required")
            .Must(BeAValidDate).WithMessage("DateSale must be a valid date in format yyyy-MM-dd");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters");

        RuleFor(x => x.Value)
            .GreaterThanOrEqualTo(0).WithMessage("Value must be greater than or equal to zero");

        RuleFor(x => x.Tax)
            .GreaterThanOrEqualTo(0).WithMessage("Tax must be greater than or equal to zero");
    }

    private bool BeAValidDate(string dateString)
    {
        return DateTime.TryParse(dateString, out _);
    }
}

