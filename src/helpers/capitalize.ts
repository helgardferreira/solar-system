export default function capitalize(string: string): string {
  return string
    .split(" ")
    .map((word) => {
      return word.charAt(0).toLocaleUpperCase() + word.slice(1);
    })
    .join(" ");
}
