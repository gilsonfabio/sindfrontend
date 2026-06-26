"use client"

import React from 'react'
import Image from 'next/image'
import logoBarra from '../assets/images/logo-barra.png'
import Link from 'next/link';

const Menubar = () => {   
    return (
        <nav className="bg-black p-2">
            <div className="flex justify-between items-center mx-auto">
                <div className="flex flex-row items-center ml-2 md:ml-36" >
                    <div className="flex items-center ">
                        <Link href="/" passHref>
                            <Image src={logoBarra} alt="" width={140} height={30} />
                        </Link>                        
                    </div>                    
                </div> 
                <div className="flex flex-row items-center mr-2 md:mr-36" >
                    <Link href='/SignUpForm' className='mr-3 inline-block px-6 py-2 border-2 border-green-600 text-green-600 hover:border-white hover:text-white font-medium text-xs leading-tight uppercase rounded-full hover:bg-green-600 hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>
                        Login Convênio
                    </Link>
                    <Link href='/SignInServ' className='inline-block px-6 py-2 border-2 border-green-600 text-green-600 hover:border-white hover:text-white font-medium text-xs leading-tight uppercase rounded-full hover:bg-green-600 hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>
                        Login Servidor
                    </Link>            
                </div>                          
            </div>
        </nav> 
    )
}

export default Menubar
