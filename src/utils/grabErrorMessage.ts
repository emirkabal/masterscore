export default (error: any) => {
  return error?.data?.message || "Something went wrong."
}
