export function formatPrice(price) {
	const formatter = Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "BRL",
	}).format(price);
	return formatter;
}
