import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { DottedSeparator } from './dotted-separator'
import { Navigation } from './navigation'
import { WorkSpaceSwitcher } from './workspace-switcher'

const Sidebar = () => {
    return (
        <aside className='h-full bg-neutral-100 p-4 w-full'>
            <Link href="/">
                <Image src="/logo.svg" width={164} height={48} alt="" />
            </Link>
            <DottedSeparator className='my-4' />
            <WorkSpaceSwitcher />
            <DottedSeparator className='my-4' />
            <Navigation />
        </aside>
    )
}

export default Sidebar
