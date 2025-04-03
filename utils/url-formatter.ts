export function formatUrl(fileUrl: string) {
  const valueToReplace = "https://utfs.io/f/"
  const newUrl = fileUrl.replace(new RegExp(valueToReplace, "i"), "")

  return newUrl
}
