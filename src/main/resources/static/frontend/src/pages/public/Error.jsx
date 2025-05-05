import FooterComp from "../../components/common/FooterComp";
import Navbar from "../../components/common/Navbar";
import React from 'react';
import { Link } from 'react-router-dom';


function Error(){

    return(
        
        <>
        <Navbar/>

        {/* Error Section */}
        <div className="flex min-h-screen flex-col items-center  px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto h-12 w-12 rounded-full" />
                    <h1 className="mt-4 text-6xl font-bold tracking-tight text-[#FFFFFF] sm:text-8xl">404</h1>
                    <p className="mt-4 text-2xl text-[#FFFFFF]">
                    Oops, it looks like the page you're looking for doesn't exist.
                    </p>
                    <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center rounded-md bg-[#A855F7] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-purple-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>

        <FooterComp/>
        </>
    )


}

export default Error;