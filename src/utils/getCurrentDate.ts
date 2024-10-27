export const getCurrentDate = () => {
  const now = new Date()
  // UTC offset'ini alıyoruz
  const timezoneOffset = now.getTimezoneOffset()
  const offsetSign = timezoneOffset > 0 ? "-" : "+"
  const absOffset = Math.abs(timezoneOffset)
  const hoursOffset = String(Math.floor(absOffset / 60)).padStart(2, "0")
  const minutesOffset = String(absOffset % 60).padStart(2, "0")

  // ISO formatına dönüştürme
  const isoString = now.toISOString().replace("Z", `${offsetSign}${hoursOffset}:${minutesOffset}`)

  return isoString
}
