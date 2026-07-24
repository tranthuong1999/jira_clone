"use client";

import { MenuIcon } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import Sidebar from './sidebar'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const MobileSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname])

    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
                <Button variant="secondary" className="lg:hidden">
                    <MenuIcon className='size-5 text-neutral-100' />
                </Button>
                <SheetContent side="left" className="p-0" >
                    <Sidebar />
                </SheetContent>
            </SheetTrigger>
        </Sheet>
    )
}

export default MobileSidebar
