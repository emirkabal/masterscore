import { createClient } from "@supabase/supabase-js"
import md5 from "md5"

const config = useRuntimeConfig()
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY, {
  auth: {
    persistSession: false
  }
})

export const remove = async (filename: string) => {
  await supabase.storage
    .from("assets")
    .remove([filename])
    .catch(() => null)
}

export const upload = async (
  path: "avatars" | "banners",
  blob: Blob
): Promise<{
  status: number
  message: string
  isSupabaseError?: boolean
  data?: string
}> => {
  try {
    if (!blob.type.startsWith("image/")) {
      return {
        status: 400,
        message: "Please upload an image file",
        isSupabaseError: false
      }
    }

    if (blob.size > 2000000) {
      return {
        status: 400,
        message: "Please upload an image less than 2mb",
        isSupabaseError: false
      }
    }

    const filename = md5(`${Date.now()}${blob.type}`)

    const { error } = await supabase.storage.from("assets").upload(`${path}/${filename}`, blob, {
      cacheControl: "3600",
      upsert: false,
      contentType: blob.type
    })

    if (error) {
      return { status: 400, message: error.message, isSupabaseError: true }
    }

    return {
      status: 200,
      message: "File uploaded successfully",
      data: filename
    }
  } catch (error) {
    return { status: 400, message: "Unknown", isSupabaseError: false }
  }
}
