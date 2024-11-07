import dayjs from 'dayjs'
import moment from 'moment'

export function secondsToTime(seconds) {
  const hrs = Math.floor(seconds / 3600) // Calculate the number of hours
  const mins = Math.floor((seconds % 3600) / 60) // Calculate the number of minutes

  // Format the result as "HH:MM" (adding leading zeroes if necessary)
  return [hrs.toString().padStart(2, '0'), mins.toString().padStart(2, '0')].join(':')
}

export function createSelectList(source = [], target = [], key = 'id') {
  const result = source?.filter((i) => target.some((c) => c?.[key] === i?.[key]))
  const ids = result?.map((item) => item?.[key]) || []
  return [...new Set(ids)]
}

export function convertToCustomFormat(dateTimeString) {
  // Create a new Date object from the given datetime string
  const date = new Date(dateTimeString)
  return moment(date).format('DD.MM.YYYY  hh:mm')
}

export function addSpaceEveryThreeChars(input) {
  // Convert the input to a string, in case it's a number
  const str = input?.toString()
  // Split the string into an array and reverse it to process from the end
  const reversed = str?.split('').reverse()
  // Add a space every three characters
  const spaced = reversed?.map((char, index) => {
    return index % 3 === 0 && index !== 0 ? char + ' ' : char
  })

  // Reverse the string back to its original order and join it
  return spaced?.reverse()?.join('')
}

export function secondsToDayjs(seconds) {
  // Create a Day.js object representing the time starting from the Unix epoch (1970-01-01 00:00:00 UTC)
  return dayjs().startOf('day').add(seconds, 'second')
}

// Function to convert a Day.js object back to total seconds
export function dayjsToSeconds(dayjsObj) {
  // Get the difference between the Day.js object and the start of the day (midnight), in seconds
  return dayjsObj.diff(dayjs().startOf('day'), 'second')
}
function difference(arr1, arr2) {
  return arr1.filter((element) => !arr2.some((i) => i?.id === element?.id))
}
