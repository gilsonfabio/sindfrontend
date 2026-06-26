"use client"

import React from "react";
import { Zoom } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const Slideshow = () => {
	const images = [
        "https://frontsindicaldas-l33s.vercel.app/images/image01.jpg", 
        "https://frontsindicaldas-l33s.vercel.app/images/image02.jpg", 
        "https://frontsindicaldas-l33s.vercel.app/images/image03.jpg", 
        "https://frontsindicaldas-l33s.vercel.app/images/image04.jpg", 
        "https://frontsindicaldas-l33s.vercel.app/images/image05.jpg", 
    ];
    
	const zoomInProperties = {
		indicators: true,
		scale: 1.2,
		duration: 5000,
		transitionDuration: 500,
		infinite: true,
		prevArrow: (
			<div style={{ width: "30px", marginRight: "-20px", cursor: "pointer" }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					fill="#2e2e2e"
				>
					<path d="M242 180.6v-138L0 256l242 213.4V331.2h270V180.6z" />
				</svg>
			</div>
		),
		nextArrow: (
			<div style={{ width: "30px", marginLeft: "20px", cursor: "pointer" }}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					fill="#2e2e2e"
				>
					<path d="M512 256L270 42.6v138.2H0v150.6h270v138z" />
				</svg>
			</div>
		),
	};
	return (
		<div className="w-screen h-full m-0">			
			<Zoom {...zoomInProperties}>
    		    {images.map((each, index) => (
				    <div key={index} className="flex w-full ">
					    <img
						    className="w-full h-[800px] object-cover shadow-xl"
						    src={each}
					    />
						<span className="font-serif flex flex-auto absolute text-white text-3xl md:text-6xl mt-28 md:ml-32 items-center p-2 md:items-start justify-start">
							ASSOCIAÇÃO CULTURAL, ESPORTIVA E SOCIAL 
						</span>
						<span className="font-serif flex flex-auto absolute text-white text-3xl md:text-6xl mt-56 md:mt-48 md:ml-32 items-center p-2 md:items-start justify-start">
							DOS SERVIDORES PÚBLICOS MUNICIPAIS DE CALDAS NOVAS
						</span>
				    </div>
			    ))}
			</Zoom>
		</div>
	);
};

export default Slideshow;