import supabase from "./supabase"

let cachedUserId = null

export const getUserId = async () => {
    if (cachedUserId) {
        return cachedUserId
    }

    try {
        const { data, error } = await supabase.auth.refreshSession()
        
        if (error) {
            console.error("Error refreshing session:", error)
            return null
        }

        const userId = data?.session?.user?.id
        cachedUserId = userId || null
        return cachedUserId
    } catch (err) {
        console.error("Unexpected error:", err)
        return null
    }
}