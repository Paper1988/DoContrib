'use client'

import Image from 'next/image'

export const LogoIcon = () => {
    return (
        <Image
            width="36"
            height="36"
            src="/DoContrib.jpg"
            alt="DoContrib Icon"
            className="rounded-full"
        />
    )
}
