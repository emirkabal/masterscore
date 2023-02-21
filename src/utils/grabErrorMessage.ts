export default (error: any) => {
  if (typeof error.message === "string") {
    return error.message
  } else if (typeof error.message === "object") {
    return error.message.error.details[0].message
  } else {
    return "An unknown error occurred"
  }
}
