import supabase from "./supabase"

export const getPledge = async (userId) => {

    const {data, error} = await supabase
    .from('users')
    .select('pledged_minutes')
    .eq('user_id', userId)
    if (error) {
        console.log(error)
        return null
    }
    return data
}