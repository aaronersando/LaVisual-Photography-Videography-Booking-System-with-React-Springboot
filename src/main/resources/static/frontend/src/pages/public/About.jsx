import React from 'react';
import Navbar from '../../components/common/Navbar';
import FooterComp from '../../components/common/FooterComp';
import { Link } from 'react-router-dom';
import tine from '../../assets/about/clint.webp';
import teo from '../../assets/about/teo.webp';
import nick from '../../assets/about/nick.webp';
import clint from '../../assets/about/clint.webp';
import nald from '../../assets/about/nald.webp';
import lei from '../../assets/about/lei.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUsers, faAward, faVideo } from '@fortawesome/free-solid-svg-icons';

function About() {
  return (
    <>
        <Navbar/>
        <div className="min-h-screen bg-gray-900 text-gray-400 pt-16 pb-20 flex justify-center items-center">
        <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-20">
                <h1 className="text-4xl font-bold mb-4 text-white">About LaVisual</h1>
                <p className="max-w-2xl mx-auto">
                    A passionate team of photographers and videographers dedicated
                    to capturing your special moments with creativity and
                    professionalism.
                </p>
            </div>

            {/* Team Story Section */}
            <section className="relative mb-40 flex justify-center items-center mx-30">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-gray-400">
                    <h2 className="text-2xl font-bold text-white text-left mb-6">Our Story</h2>
                    <p className="mb-4">
                        Founded in 2023, LaVisual began as a freelance creatives with a big vision.
                        To create stunning visual content that tells powerful stories and preserves precious memories.
                    </p>
                    <p className="mb-4">
                        Over the years, we've grown into a full-service photography and videography
                        company, working with clients across the country. Our team has expanded to
                        include specialists in various photography and videography niches, allowing
                        us to offer comprehensive services for any occasion.
                    </p>
                    <p>
                        What sets us apart is our commitment to personalized service and artistic excellence.
                        We believe that every client deserves a unique approach tailored to their specific vision and needs.
                    </p>
                    </div>
                    <div className="flex-shrink-0 w-[600px] h-[450px] bg-gray-700 rounded-lg">
                    <img src={lei} alt="Lei" className="w-full h-full object-cover rounded-lg" />
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="text-center mb-40 flex justify-center items-center mx-30">
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Our Values</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 justify-center items-center">
                <div className="bg-gray-800 p-6 pt-10 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 w-[290px] h-[260px] flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faCamera} className="text-[#9333EA] text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Artistic</h3>
                    <p className="text-gray-400 text-center">We craft visuals that tell stories.</p>
                </div>
                <div className="bg-gray-800 p-6 pt-10 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 w-[290px] h-[260px] flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faUsers} className="text-[#9333EA] text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Client Focus</h3>
                    <p className="text-gray-400 text-center">Your vision, our mission.</p>
                </div>
                <div className="bg-gray-800 p-6 pt-10 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 w-[290px] h-[260px] flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faAward} className="text-[#9333EA] text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Excellence</h3>
                    <p className="text-gray-400 text-center">Details matter, quality define us.</p>
                </div>
                <div className="bg-gray-800 p-6 pt-10 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700 w-[290px] h-[260px] flex flex-col items-center">
                    <div className="w-12 h-12 bg-[#C084FC] rounded-full mb-4 flex justify-center items-center">
                    <FontAwesomeIcon icon={faVideo} className="text-[#9333EA] text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Innovation</h3>
                    <p className="text-gray-400 text-center">Always evolving, always inspired.</p>
                </div>
                </div>
            </div>
            </section>

            {/* Team Members Section */}
            <section className="text-center mb-10 flex justify-center items-center">
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Meet our Team</h2>
                <div className="flex justify-center gap-10 mb-10">
                <div className="bg-gray-800 rounded-lg shadow-md w-[295px] h-[475px] transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700">
                    <img src={tine} alt="Lead Photographer" className="w-[295px] h-[255px] object-cover rounded-t-lg" />
                    <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Tine De Leon</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Lead Photographer</p>
                    <p className="text-gray-400 mt-2">
                        Tine has over 10 years of experience capturing weddings, events, and portraits. His unique style combines
                        photojournalism with artistic composition.
                    </p>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-md w-[295px] h-[475px] transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700">
                    <img src={nick} alt="Senior Videographer" className="w-[295px] h-[255px] object-cover rounded-t-lg" />
                    <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Nic Ople</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Senior Videographer</p>
                    <p className="text-gray-400 mt-2">
                        With a background in film production, Nic creates cinematic videos that tell compelling stories.
                        He specializes in wedding films and commercial projects.
                    </p>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-md w-[295px] h-[475px] transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700">
                    <img src={teo} alt="Portrait Specialist" className="w-[295px] h-[255px] object-cover rounded-t-lg" />
                    <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Teo Espique</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Portrait Specialist</p>
                    <p className="text-gray-400 mt-2">
                        Teo has a gift for capturing personalities in his portrait work.
                        His relaxed approach puts subjects at ease, resulting in natural and authentic images.
                    </p>
                    </div>
                </div>
                </div>
                <div className="flex justify-center gap-10">
                <div className="bg-gray-800 rounded-lg shadow-md w-[295px] h-[475px] transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700">
                    <img src={nald} alt="Event Photographer" className="w-[295px] h-[255px] object-cover rounded-t-lg" />
                    <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Nald Magana</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Event Photographer</p>
                    <p className="text-gray-400 mt-2">
                        Nald excels at capturing the energy and emotion of events. From corporate gatherings to music festivals, he
                        documents all the key moments.
                    </p>
                    </div>
                </div>
                <div className="bg-gray-800 rounded-lg shadow-md w-[295px] h-[475px] transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700">
                    <img src={clint} alt="Event Photographer" className="w-[295px] h-[255px] object-cover rounded-t-lg" />
                    <div className="p-4 text-left">
                    <h3 className="text-xl font-bold text-white">Clint Salvador</h3>
                    <p className="text-sm" style={{ color: '#C084FC' }}>Event Photographer</p>
                    <p className="text-gray-400 mt-2">
                        Clint thrives on capturing the atmosphere and emotions on live events, ensuring no memory
                        goes unnoticed.
                    </p>
                    </div>
                </div>
                </div>
            </div>
            </section>

            {/* Contact Us Section */}
            <section className="text-center mt-20 mb-10 flex flex-col justify-center items-center">
            <div className="max-w-2xl mb-6">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to Work with Us?</h2>
                <p className="text-gray-400">
                Let's create something beautiful together. Contact us to discuss your project or book a session.
                </p>
            </div>
            <div className="flex justify-center gap-4">
                <Link to={'/contact'}>
                    <button className="bg-[#9333EA] text-white w-[125px] h-[50px] rounded-[6px] hover:scale-105 hover:bg-purple-700 transition text-x1">
                    Contact Us
                    </button>
                </Link>
                <Link to={'/portfolio'}>
                    <button className="bg-transparent text-white w-[155px] h-[50px] rounded-[6px] hover:scale-105 border border-white hover:bg-gray-700 transition text-x1">
                    View Our Work
                    </button>
                </Link>
            </div>
            </section>
        </div>
        </div>
        <FooterComp/>
    </>
  );
};

export default About;