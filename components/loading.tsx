import { CircularProgress } from '@mui/material'

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center h-screen relative overflow-auto">
            <CircularProgress size={70} style={{ color: 'white' }} />
        </div>
    )
}
