def apply_discount(price_cents: int, percent: int) -> int:
    """Return the price after a percentage discount, rounded down to whole cents."""
    discount_amount = price_cents * percent // 100
    return price_cents - discount_amount