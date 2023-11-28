namespace RiskControl.Attributes;

using System;
using System.ComponentModel.DataAnnotations;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field)]
public sealed class DateRangeLessThanAttribute(string dateFromFieldName, int months) : ValidationAttribute(string.Empty)
{
    public string DateFromFieldName { get; } = dateFromFieldName;

    public int Months { get; } = months;

    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        var valid = IsValidationContext(validationContext) && IsValidDateRange(value, validationContext);

        return valid
            ? ValidationResult.Success
            : new ValidationResult(FormatErrorMessage(validationContext.DisplayName));
    }

    public override string FormatErrorMessage(string name) => $"Data range should not exceed {Months} months";

    private bool IsValidationContext(ValidationContext validationContext)
    {
        var property = validationContext.ObjectType.GetProperty(DateFromFieldName);
        return property != null;
    }

    private bool IsValidDateRange(object value, ValidationContext validationContext)
    {
        var dateFrom = GetDateFrom(validationContext);
        return (DateTime)value <= dateFrom.AddMonths(Months);
    }

    private DateTime GetDateFrom(ValidationContext context)
    {
        var property = context.ObjectType.GetProperty(DateFromFieldName);
        return (DateTime)property.GetValue(context.ObjectInstance, null);
    }
}
