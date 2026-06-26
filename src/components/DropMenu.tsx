import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";

import { useTheme } from 'next-themes'

import { FaInfoCircle } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaYoutube } from 'react-icons/fa';
import { FaAdjust } from 'react-icons/fa';
import { FaHandsWash } from 'react-icons/fa';
import { FaEllipsisV } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
import { FaHandPaper } from 'react-icons/fa';
import Link from "next/link";

function DropMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);  
  const {theme, setTheme} =  useTheme();
  const [showOptions, setShowOptions] = useState(false);

  const handleClick = () => {
      setShowOptions(!showOptions);      
  };

  useEffect(() => {
    setMounted(true);    
    if (theme) {
      localStorage.setItem("atualTheme", theme);
    }
  },[theme]);

  if(!mounted) return null

  return (
    <div>
      <nav className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center">              
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-4">
                    <button className="text-white hover:text-gray-400 px-1 py-2 text-sm font-medium" onClick={() => {}}></button>
                    <Link href="/SignUpForm"> 
                      <a className="text-white hover:text-gray-400 px-1 py-2 text-sm font-medium"><FaInfoCircle className="w-4 h-4 fa-solid fa-circle-info"/></a>
                    </Link>  
                    <Link href="https://www.facebook.com/PrefAparecida/"> 
                      <a target="_blank" className="text-white hover:text-gray-400 px-1 py-2 text-sm font-medium"><FaFacebook className="w-4 h-4 fa-solid fa-circle-info"/></a>
                    </Link>
                    <Link href="https://www.instagram.com/prefaparecida/"> 
                      <a target="_blank" className="text-white hover:text-gray-400 px-1 py-2 text-sm font-medium"><FaInstagram className="w-4 h-4 fa-solid fa-circle-info"/></a>
                    </Link>
                    <Link href="https://www.youtube.com/channel/UC-YvAQ4nT9_sewdzsp1zWjw">  
                      <a target="_blank"  className="text-white hover:text-gray-400 px-1 py-2 text-sm font-medium"><FaYoutube className="w-4 h-4 fa-solid fa-circle-info"/></a>
                    </Link>
                    <button onClick={handleClick} id="dropdownButton" data-dropdown-toggle="dropdown" type="button"
                        className="z-5 hover:text-gray-400 font-medium rounded-lg text-white text-sm px-2 py-2 text-center inline-flex items-center"> 
                        <FaHandsWash className="w-4 h-4"/>
                    </button>
                    {showOptions && (
                    <div className="z-10 absolute md:origin-top-right md:absolute md:right-6 md:mt-20 w-72 md:w-36 shadow-gray-800 bg-gray-300 dark:bg-gray-900 ring-1 ring-black dark:ring-white ring-opacity-5 rounded-md " role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                        <div className="flex flex-row py-1" role="none">                          
                            <button className="btn inline-block -mt-2 px-2 py-2 text-black dark:text-white font-medium text-xl leading-tight uppercase rounded hover:text-gray-600 transition duration-150 ease-in-out" type="button" id="button-search"><p className="w-4 h-4 rounded-r-lg text-xl">A-</p></button>              
                            <button className="btn inline-block -mt-2 px-2 py-2 text-black dark:text-white font-medium text-xl leading-tight uppercase rounded hover:text-gray-600 transition duration-150 ease-in-out" type="button" id="button-search"><p className="w-4 h-4 rounded-r-lg text-xl">A+</p></button>              
                            <button className="text-black dark:text-white hover:text-gray-400 ml-1 px-2 py-2 text-sm font-medium" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}><FaAdjust className="w-4 h-4 fa-solid fa-circle-info"/></button>                  
                            <button className="btn inline-block px-2 py-2 ml-1 text-black dark:text-white font-medium text-xs leading-tight uppercase rounded hover:text-gray-600 transition duration-150 ease-in-out" type="button" id="button-search"><FaHandPaper className="w-4 h-4 rounded-r-lg"/></button>              
                        </div>
                    </div>
                    )} 
                </div>
              </div>
            </div>
            <div className="-mr-0 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-black inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-light "
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <FaEllipsisV className="w-5 h-5 fa-solid"/>
                ) : (
                  <FaTimes className="w-5 h-5 fa-solid"/>
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={isOpen }
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
                <div className="bg-black rounded-b-lg origin-center absolute px-2 py-0 w-12 mx-3 z-20 flex flex-col">
                    <Link href="/SignUpForm"> 
                      <a className="bg-black text-white hover:text-gray-400 px-2 py-3 text-sm font-medium"><FaInfoCircle className="w-5 h-5 fa-solid fa-circle-info"/></a>
                    </Link>
                    <Link href="https://www.facebook.com/PrefAparecida/">
                      <a target="_blank"  className="bg-black text-white hover:text-gray-400 px-2 py-3 text-sm font-medium"><FaFacebook className="w-5 h-5 fa-solid fa-circle-info"/></a>
                    </Link>
                    <Link href="https://www.instagram.com/prefaparecida/"> 
                      <a target="_blank" className="bg-black text-white hover:text-gray-400 px-2 py-3 text-sm font-medium" ><FaInstagram className="w-5 h-5 fa-solid fa-circle-info"/></a>
                    </Link>
                    <Link href="https://www.youtube.com/channel/UC-YvAQ4nT9_sewdzsp1zWjw"> 
                      <a target="_blank"  className="bg-black text-white hover:text-gray-400 px-2 py-3 text-sm font-medium" ><FaYoutube className="w-5 h-5 fa-solid fa-circle-info"/></a>
                    </Link>
                    <button onClick={handleClick} id="dropdownButton" data-dropdown-toggle="dropdown" type="button"
                      className="z-5 hover:text-gray-600 font-medium rounded-lg text-white text-sm px-2 py-2 text-center inline-flex items-center"> 
                      <FaHandsWash className="w-6 h-6"/>
                    </button>
                    {showOptions && (
                    <div className="z-10 absolute origin-top-right right-11 mt-44 w-38 shadow-gray-800 bg-black dark:bg-gray-900 ring-1 ring-black dark:ring-white ring-opacity-5 rounded-l-lg" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                        <div className="flex flex-row py-1" role="none">                          
                            <button className="btn inline-block px-3 py-2 -mt-1 text-white font-medium text-xs leading-tight uppercase rounded hover:text-gray-600 transition duration-150 ease-in-out" type="button" id="button-search"><p className="w-4 h-4 rounded-r-lg text-xl">A-</p></button>              
                            <button className="btn inline-block px-3 py-2 -mt-1 text-white font-medium text-xs leading-tight uppercase rounded hover:text-gray-600 transition duration-150 ease-in-out" type="button" id="button-search"><p className="w-4 h-4 rounded-r-lg text-xl">A+</p></button>              
                            <button className="text-white hover:text-gray-400 px-3 py-2 text-sm font-medium" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}><FaAdjust className="w-4 h-4 fa-solid fa-circle-info"/></button>                  
                            <button className="btn inline-block px-3 py-2 text-white font-medium text-xs leading-tight uppercase rounded hover:text-gray-600 transition duration-150 ease-in-out" type="button" id="button-search"><FaHandPaper className="w-4 h-4 rounded-r-lg"/></button>              
                        </div>
                    </div>
                    )} 
                </div>
            </div>
          )}
        </Transition>
      </nav>      
    </div>
  );
}

export default DropMenu;