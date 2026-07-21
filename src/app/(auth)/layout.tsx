import Image from 'next/image'
import React from 'react'
import { Button } from '../../../components/ui/button'
type AuthLayoutProps = {
    children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <main className='bg-neutral-100 min-h-screen'>
            <div className='mx-auto max-w-screen-2xl pl-4'>
                <nav className='flex justify-between items-center'>
                    <Image src="/logo.svg" alt="Logo" width={152} height={56} />
                    <div className='flex items-center gap-2'>
                        <Button variant="secondary"> Sign up</Button>
                    </div>
                </nav>
                <div className='flex flex-col items-center justify-center pt-4 md:pt-14'>
                    {children}
                </div>
            </div>
        </main>
    )
}

export default AuthLayout
