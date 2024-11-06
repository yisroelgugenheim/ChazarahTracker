import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
export default function PageNotFound() {

    return (
        <>
            <h1 style={{ color: 'silver' }} >PAGE NOT FOUND!</h1>

            <Link style={{ color: 'grey' }} to={'/'}>Back</Link>
        </>

    )
}

