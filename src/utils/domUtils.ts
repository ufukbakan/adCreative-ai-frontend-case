export function getCumilativeAriaLabels(element: HTMLElement): string[] {
  const ariaLabels = [];
  if (element?.ariaLabel) ariaLabels.push(element.ariaLabel);
  if (element?.parentElement) ariaLabels.push(...getCumilativeAriaLabels(element.parentElement));
  return ariaLabels;
}
