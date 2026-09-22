import React from 'react'

const loading = () => {
    return (
        <div className="flex fixed top-0 left-0 z-50 items-center justify-center bg-white/30 backdrop-blur-lg h-screen w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
    )
}

export default loading