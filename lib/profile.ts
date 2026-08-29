export const profile = {
  birthdate: new Date(2000, 1, 17),
  city: "Belo Horizonte",
  country: "Brazil",
} as const;

export function getAge(
  birthdate: Date,
  referenceDate: Date = new Date(),
): number {
  let age = referenceDate.getFullYear() - birthdate.getFullYear();
  const hasHadBirthdayThisYear =
    referenceDate.getMonth() > birthdate.getMonth() ||
    (referenceDate.getMonth() === birthdate.getMonth() &&
      referenceDate.getDate() >= birthdate.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

export function formatAboutText(
  template: string,
  values: { name: string; age: number },
): string {
  return template
    .replaceAll("{name}", values.name)
    .replaceAll("{age}", String(values.age));
}
