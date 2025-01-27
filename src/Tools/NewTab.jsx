// import React, { useState, useEffect, useRef } from 'react';
// import { FaFilePdf, FaTasks, FaCalculator, FaTh } from 'react-icons/fa';
// import { Link } from 'react-router-dom';
// import ButtonComponent from './ButtonComponent';
// import { FaList } from 'react-icons/fa6';
// import GridComponent from './GridComponent';

// const NewTab = () => {
//     const [isPopupOpen, setPopupOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [viewType, setViewType] = useState('list');
//     const searchInputRef = useRef(null);

//     const tools = [
//         { name: 'Image To Pdf', path: '/imagetopdf', icon: <FaFilePdf className="mr-3 text-red-500" /> },
//         { name: 'Split Pdf', path: '/splitpdf', icon: <FaFilePdf className="mr-3 text-red-500" /> },
//         { name: 'Grocery List', path: '/grocery', icon: <FaTasks className="mr-3 text-purple-500" /> },
//         { name: 'Calculator', path: '/calculator', icon: <FaCalculator className="mr-3 text-teal-500" /> },
//         { name: 'Percentage Calculator', path: '/percentage', icon: <FaCalculator className="mr-3 text-teal-500" /> },
//         { name: 'BMI Calculator', path: '/bmi', icon: <FaCalculator className="mr-3 text-teal-500" /> },
//         { name: 'Fahrenheit to Celsius', path: '/faren-to-celcius', icon: <FaFilePdf className="mr-3 text-blue-500" /> },
//         { name: 'Seconds to HH:MM:SS', path: '/second', icon: <FaFilePdf className="mr-3 text-blue-500" /> },
//         { name: 'HH:MM:SS to Second', path: '/hours', icon: <FaFilePdf className="mr-3 text-blue-500" /> },
//         { name: 'Paypal Link Generator', path: '/paypal', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
//         { name: 'HTML Beautifier', path: '/beautifier', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
//         { name: 'Resume Builder', path: '/resumebuild', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
//         { name: 'Website Link Checker', path: '/linkchecker', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
//     ];

//     // Toggle popup visibility on Ctrl + K press
//     useEffect(() => {
//         const handleKeyDown = (event) => {
//             if (event.ctrlKey && event.key === 'k') {
//                 event.preventDefault(); // Prevent browser search
//                 setPopupOpen((prev) => !prev);
//             }
//         };

//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, []);

//     // Focus the search input when the popup opens
//     useEffect(() => {
//         if (isPopupOpen && searchInputRef.current) {
//             searchInputRef.current.focus();
//         }
//     }, [isPopupOpen]);

//     // Filter tools based on search query
//     const filteredTools = tools.filter((tool) =>
//         tool.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     return (
//         <div className="App min-h-screen bg-zinc-100 p-8">
//             <header className="text-center mb-12">
//                 <h1 className="text-5xl font-bold mb-4">DAILY TOOLS</h1>
//             </header>

//             {/* Search Bar */}
//             <div className="flex justify-center mb-12">
//                 <div className="relative w-full max-w-lg">
//                     <input
//                         type="text"
//                         className="w-full border rounded-lg p-4 focus:outline-none shadow-sm"
//                         placeholder="Search tools..."
//                     />
//                     <div className="absolute right-4 top-4 text-gray-400">Ctrl + K</div>
//                 </div>
//             </div>

//             <div className="flex gap-4 mb-8">
//                 <button
//                     onClick={() => setViewType('grid')}
//                     className={`p-2 rounded-lg ${viewType === 'grid' ? 'bg-gray-200' : ''}`}
//                 >
//                     <FaTh size={20} />
//                 </button>
//                 <button
//                     onClick={() => setViewType('list')}
//                     className={`p-2 rounded-lg ${viewType === 'list' ? 'bg-gray-200' : ''}`}
//                 >
//                     <FaList size={20} />
//                 </button>
//             </div>

//             {/* Popup Modal */}
//             {isPopupOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                     <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md h-full overflow-y-auto">
//                         <input
//                             ref={searchInputRef}
//                             type="text"
//                             className="w-full border-b-2 p-2 focus:outline-none mb-4"
//                             placeholder="Search for a tool..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                         <div>
//                             {filteredTools.length > 0 ? (
//                                 filteredTools.map((tool) => (
//                                     <Link to={tool.path} key={tool.name} className="block mb-2">
//                                         <button className="flex items-center p-2 rounded-lg hover:bg-gray-100 w-full">
//                                             {tool.icon}
//                                             <span>{tool.name}</span>
//                                         </button>
//                                     </Link>
//                                 ))
//                             ) : (
//                                 <p className="text-gray-500">No tools found.</p>
//                             )}
//                         </div>
//                         <button
//                             className="mt-4 text-sm text-blue-500"
//                             onClick={() => setPopupOpen(false)}
//                         >
//                             Close
//                         </button>
//                     </div>
//                 </div>
//             )}

//             {/* Tool Categories */}
//             {viewType === 'list' ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
//                 <div>
//                     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4">PDF</h3>
//                     <ButtonComponent path="/imagetopdf" name="Image To Pdf" icon={<FaFilePdf className="mr-3 text-red-500" />} />
//                     <ButtonComponent path="/splitpdf" name="Split Pdf" icon={<FaFilePdf className="mr-3 text-red-500" />} />
//                 </div>
//                 <div>
//                     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4">TODO</h3>
//                     <ButtonComponent path="/grocery" name="Grocery List" icon={<FaTasks className="mr-3 text-purple-500" />} />
//                 </div>
//                 <div>
//                     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4">CALCULATOR</h3>
//                     <ButtonComponent path="/calculator" name="Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
//                     <ButtonComponent path="/percentage" name="Percentage Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
//                     <ButtonComponent path="/bmi" name="BMI Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
//                 </div>

//                 {/* CONVERTER Section */}
//                 <div>
//                     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4">CONVERTER</h3>
//                     <ButtonComponent path="/faren-to-celcius" name="Fahrenheit to Celsius" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
//                     <ButtonComponent path="/second" name="Seconds to HH:MM:SS" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
//                     <ButtonComponent path="/hours" name="HH:MM:SS to Second" icon={<FaFilePdf className="mr-3 text-blue-500" />} />

//                 </div>

//                 {/* MISC Section */}
//                 <div>
//                     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4">MISC</h3>
//                     <ButtonComponent path="/paypal" name="Paypal Link Generator" icon={<FaFilePdf className="mr-3 text-pink-500" />} />
//                     <ButtonComponent path="/beautifier" name="HTML Beautifier" icon={<FaFilePdf className="mr-3 text-pink-500" />} />
//                     <ButtonComponent path="/resumebuild" name="Resume Builder" icon={<FaFilePdf className="mr-3 text-pink-500" />} />
//                     <ButtonComponent path="/linkchecker" name="Website Link Checker" icon={<FaFilePdf className="mr-3 text-pink-500" />} />

//                 </div>
//             </div>
//             ):(
//                 <div className="grid grid-cols-1 gap-8">
//   {/* PDF Section */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
//     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">PDF</h3>
//     <GridComponent path="/imagetopdf" name="Image To Pdf" icon={<FaFilePdf className="text-red-500" />} />
//     <GridComponent path="/splitpdf" name="Split Pdf" icon={<FaFilePdf className="text-red-500" />} />
//   </div>

//   {/* TODO Section */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
//     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">TODO</h3>
//     <GridComponent path="/grocery" name="Grocery List" icon={<FaTasks className="text-purple-500" />} />
//   </div>

//   {/* Calculator Section */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
//     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">CALCULATOR</h3>
//     <GridComponent path="/calculator" name="Calculator" icon={<FaCalculator className="text-teal-500" />} />
//     <GridComponent path="/percentage" name="Percentage Calculator" icon={<FaCalculator className="text-teal-500" />} />
//     <GridComponent path="/bmi" name="BMI Calculator" icon={<FaCalculator className="text-teal-500" />} />
//   </div>

//   {/* Converter Section */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
//     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">CONVERTER</h3>
//     <GridComponent path="/faren-to-celcius" name="Fahrenheit to Celsius" icon={<FaFilePdf className="text-blue-500" />} />
//     <GridComponent path="/second" name="Seconds to HH:MM:SS" icon={<FaFilePdf className="text-blue-500" />} />
//     <GridComponent path="/hours" name="HH:MM:SS to Second" icon={<FaFilePdf className="text-blue-500" />} />
//   </div>

//   {/* Misc Section */}
//   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
//     <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">MISC</h3>
//     <GridComponent path="/paypal" name="Paypal Link Generator" icon={<FaFilePdf className="text-pink-500" />} />
//     <GridComponent path="/beautifier" name="HTML Beautifier" icon={<FaFilePdf className="text-pink-500" />} />
//     <GridComponent path="/resumebuild" name="Resume Builder" icon={<FaFilePdf className="text-pink-500" />} />
//     <GridComponent path="/linkchecker" name="Website Link Checker" icon={<FaFilePdf className="text-pink-500" />} />
//   </div>
// </div>

//             )}

//         </div>
//     );
// };

// export default NewTab;





import React, { useState, useEffect, useRef } from 'react';
import { FaFilePdf, FaTasks, FaCalculator, FaTh, FaFileImage, FaEdit, FaUnlockAlt, FaLock, FaStream, FaCropAlt } from 'react-icons/fa';
import { AiFillFileText, AiOutlineMergeCells, AiOutlineNumber } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import ButtonComponent from './ButtonComponent';
import { FaCompress, FaList, FaScissors } from 'react-icons/fa6';
import GridComponent from './GridComponent';
import Header from './Component/Header';

const NewTab = () => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewType, setViewType] = useState('grid');
    const searchInputRef = useRef(null);
    const popupRef = useRef(null);
    const removeinput = () => {
        setSearchQuery('');
        setPopupOpen(true)
    }

    const tools = [
        { name: 'Image To Pdf', path: '/imagetopdf', icon: <FaFilePdf className="mr-3 text-red-500" /> },
        { name: 'Split Pdf', path: '/splitpdf', icon: <FaFilePdf className="mr-3 text-red-500" /> },
        { name: 'Grocery List', path: '/grocery', icon: <FaTasks className="mr-3 text-purple-500" /> },
        { name: 'Calculator', path: '/calculator', icon: <FaCalculator className="mr-3 text-teal-500" /> },
        { name: 'Percentage Calculator', path: '/percentage', icon: <FaCalculator className="mr-3 text-teal-500" /> },
        { name: 'BMI Calculator', path: '/bmi', icon: <FaCalculator className="mr-3 text-teal-500" /> },
        { name: 'Fahrenheit to Celsius', path: '/faren-to-celcius', icon: <FaFilePdf className="mr-3 text-blue-500" /> },
        { name: 'Seconds to HH:MM:SS', path: '/second', icon: <FaFilePdf className="mr-3 text-blue-500" /> },
        { name: 'HH:MM:SS to Second', path: '/hours', icon: <FaFilePdf className="mr-3 text-blue-500" /> },
        { name: 'Paypal Link Generator', path: '/paypal', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'HTML Beautifier', path: '/beautifier', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Resume Builder', path: '/resumebuild', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Website Link Checker', path: '/linkchecker', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Compress pdf', path: '/compress', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Merge pdf', path: '/mergepdf', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Word To Pdf', path: '/pdfconverter', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Search Excel', path: '/searchpdf', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Search Pdf', path: '/searchexcelpdf', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Edit Pdf', path: '/editpdf', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Extract Page', path: '/extractpages', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Pdf Cropper', path: '/pdfcropper', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Add page number', path: '/addpagenum', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Protect Pdf', path: '/protect', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Unlock Pdf', path: '/unlockpdf', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Pdf To image', path: '/pdftoimage', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Pdf To Word', path: '/pdftoword', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Scientific Calculator', path: '/scientific', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Email Checker', path: '/bulkemailchecker', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Email Sender', path: '/bulkemailsender', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Google Map Extractor', path: '/googlemap', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Compare Loan', path: '/compareloan', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Card Validator', path: '/cardvalidation', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Card Generator', path: '/cardgenerator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Html template Generator', path: '/templategenerator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Currency Converter', path: '/currencyconverter', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Text To Speech', path: '/texttospeech', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Speech To Text', path: '/speechtotext', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Online Voice Recorder', path: '/onlinevoiceRecorder', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Online Screen Recorder', path: '/onlinescreenRecorder', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Online ScreenShot', path: '/onlinescreenshot', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Online WebCam Test', path: '/onlinewebcamtest', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Phone Number Formatter', path: '/phonenumberformat', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Random Password Generator', path: '/randompassword', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Fraction Calculator', path: '/fractioncalculator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Average Calculator', path: '/averagecalculator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'LCM Calculator', path: '/lcm', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Age Calculator', path: '/agecalculator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Date Difference Calculator', path: '/datediffcalculator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Linkedin Scraper', path: '/linkedinscraper', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Calendar', path: '/calendar', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Clock', path: '/clock', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Stop Watch', path: '/stopwatch', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Countdown', path: '/timer', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Alarm Clock', path: '/alarm', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Binary To Decimal', path: '/binarytodecimal', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Word Counter', path: '/wordcounter', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Compound Interest Calculator', path: '/compoundintrest', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Simple Interest Calculator', path: '/simpleinterest', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Discount Calculator', path: '/discountcalculator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'GST Calculator', path: '/gstcalculator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'VAT Calculator', path: '/vatcalculator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Electricity bill Calculator', path: '/electricitybill', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
        { name: 'Test Score Calculator', path: '/testscorecalculator', icon: <FaFilePdf className="mr-3 text-pink-500" /> },
    ];

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'k') {
                event.preventDefault();
                setPopupOpen((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isPopupOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isPopupOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setPopupOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredTools = tools.filter((tool) =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>

            <div className="min-h-screen bg-zinc-100 flex flex-col items-center mt-14 px-8 py-6">
                {/* <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">DAILY TOOLS</h1>
                </header> */}

                {/* Search Bar */}
                <div className="w-full max-w-3xl mx-auto mt-10 mb-8 sticky rounded-lg top-16 bg-white z-10 shadow">
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full border rounded-lg p-4 shadow-sm focus:outline-none"
                            placeholder="Search tools..."
                            value={searchQuery}
                            onFocus={() => setPopupOpen(true)}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-4 top-4 text-gray-400">Ctrl + K</div>
                    </div>
                </div>

                <div className="flex gap-4 mb-8 sticky top-32 z-10 bg-white rounded-lg p-2 shadow">
                    <button
                        onClick={() => setViewType('grid')}
                        className={`p-2 rounded-lg ${viewType === 'grid' ? 'bg-gray-200' : ''}`}
                    >
                        <FaTh size={20} />
                    </button>
                    <button
                        onClick={() => setViewType('list')}
                        className={`p-2 rounded-lg ${viewType === 'list' ? 'bg-gray-200' : ''}`}
                    >
                        <FaList size={20} />
                    </button>
                </div>


                {isPopupOpen && (
                    <div className={`fixed inset-0  bg-black bg-opacity-50 flex items-center mt-14 justify-center ${viewType === 'grid' ? 'z-50' : 'z-30'}`}>
                        <div ref={popupRef} className={`bg-white  max-h-96 p-2 rounded-lg shadow-lg w-full max-w-md overflow-y-auto ${viewType === 'grid' ? 'z-50' : 'z-30'}`}>

                            <div className="flex  items-baseline ">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="w-full border-b-2 translate-x-3 bg-white p-2 focus:outline-none mb-4"
                                    placeholder="Search for a tool..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className='-translate-x-3 hover:cursor-pointer transition-all' onClick={(e) => setSearchQuery(e.target.value = '')}>clear</div>
                            </div>
                            <div className={`bg-white max-h-64 min-h-44 p-4 flex flex-col justify-between  items-start w-full max-w-md overflow-y-auto ${viewType === 'grid' ? 'z-50' : 'z-30'}`}>

                                <div className='min-h-32   w-full '>
                                    {searchQuery && filteredTools.length > 0 ? (
                                        filteredTools.map((tool) => (
                                            <Link to={tool.path} key={tool.name} className="block mb-2">
                                                <button className="flex items-center p-2 rounded-lg hover:bg-gray-100 w-full">
                                                    {tool.icon}
                                                    <span>{tool.name}</span>
                                                </button>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className='flex flex-col items-center min-h-32 justify-center'>

                                            <p className="  text-gray-500">No tools found.</p>
                                        </div>

                                    )}
                                </div>

                            </div>
                            <button
                                className=" border-t w-full p-2 text-sm text-blue-500"
                                onClick={() => setPopupOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
                <div>
                    <div className="w-full max-w-5xl mx-auto">
                        {viewType === 'list' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
                                <div>
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4">PDF</h3>
                                    <ButtonComponent path="/imagetopdf" name="Image To Pdf" icon={<FaFilePdf className="mr-3 text-red-500" />} />
                                    <ButtonComponent path="/splitpdf" name="Split Pdf" icon={<FaScissors className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/compress" name="Compress Pdf" icon={<FaCompress className="mr-3 text-red-500" />} />
                                    <ButtonComponent path="/mergepdf" name="Merge Pdf" icon={<AiOutlineMergeCells className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/pdfconverter" name="Word To Pdf" icon={<AiFillFileText className="mr-3 text-red-600" />} />
                                    <ButtonComponent path="/searchpdf" name="Search Excel" icon={<FaFilePdf className="mr-3 text-red-500" />} />
                                    {/* <ButtonComponent path="/searchexcelpdf" name="Search Pdf" icon={<FaFilePdf className="mr-3 text-red-500" />} /> */}
                                    {/* <ButtonComponent path="/upload" name="Edit Image" icon={<FaFilePdf className="mr-3 text-red-500" />} /> */}
                                    <ButtonComponent path="/editpdf" name="Edit Pdf" icon={<FaEdit className="mr-3 text-green-500" />} />
                                    <ButtonComponent path="/extractpages" name="Extract Page" icon={<FaStream className="mr-3 text-blue-800" />} />
                                    <ButtonComponent path="/pdfcropper" name="Pdf Cropper" icon={<FaCropAlt className="mr-3 text-green-300" />} />
                                    <ButtonComponent path="/addpagenum" name="Add page No." icon={<AiOutlineNumber className="mr-3 text-green-300" />} />
                                    <ButtonComponent path="/protect" name="Protect Pdf" icon={<FaLock className="mr-3 text-pink-700" />} />
                                    <ButtonComponent path="/unlockpdf" name="Unlock Pdf" icon={<FaUnlockAlt className="mr-3 text-pink-500" />} />
                                    <ButtonComponent path="/pdftoimage" name="Pdf To Image" icon={<FaFileImage className="mr-3 text-yellow-500" />} />
                                    <ButtonComponent path="/pdftoword" name="Pdf To Word" icon={<FaFilePdf className="mr-3 text-red-500" />} />

                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4">TODO</h3>
                                    <ButtonComponent path="/grocery" name="Grocery List" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                    <ButtonComponent path="/bulkemailchecker" name="Email Checker" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                    <ButtonComponent path="/bulkemailsender" name="Email Sender" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                    <ButtonComponent path="/googlemap" name="Google Map Extractor" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                    <ButtonComponent path="/cardvalidation" name="Card Validator" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                    <ButtonComponent path="/cardgenerator" name="Card Generator" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                    <ButtonComponent path="/templategenerator" name="Html Template Generator" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                    <ButtonComponent path="/phonenumberformat" name="phone Number Formatter" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                    <ButtonComponent path="/randompassword" name="Random Password Generator" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                    <ButtonComponent path="/Linkedinscraper" name="Linkedin Scrapper" icon={<FaTasks className="mr-3 text-purple-500" />} />
                                </div>
                                {/* Other Sections */}
                                <div>
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4">CALCULATOR</h3>
                                    <ButtonComponent path="/calculator" name="Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/percentage" name="% Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/bmi" name="BMI Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/scientific" name="Scientific Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/compareloan" name="Compare Loan" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/currencyconverter" name="Currency Converter" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/fractioncalculator" name="Fraction Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/averagecalculator" name="Average Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/lcm" name="LCM Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/agecalculator" name="Age Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/datediffcalculator" name="Date Difference Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/compoundintrest" name="Compound Interest Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/simpleinterest" name="Simple Interest Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/discountcalculator" name="Discount Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/gstcalculator" name="GST Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/vatcalculator" name="VAT Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/electricitybill" name="Electricity bill Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                    <ButtonComponent path="/testscorecalculator" name="Test Score Calculator" icon={<FaCalculator className="mr-3 text-teal-500" />} />
                                </div>

                                {/* CONVERTER Section */}
                                <div>
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4">CONVERTER</h3>
                                    <ButtonComponent path="/faren-to-celcius" name="Fahrenheit to Celsius" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/second" name="Second to Hour" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/hours" name="Hour to Second" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/texttospeech" name="Text To Speech" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/speechtotext" name="Speech To Text" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/onlinevoiceRecorder" name="Online Voice Recorder" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/onlinescreenRecorder" name="Online Screen Recorder" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/onlinescreenshot" name="Online ScreenShot" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/onlinewebcamtest" name="Online Webcam Test" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/calendar" name="Calendar" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/clock" name="Clock" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/stopwatch" name="Stop Watch" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/timer" name="Countdown Timer" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/alarm" name="Alarm Clock" icon={<FaFilePdf className="mr-3 text-blue-500" />} />
                                    <ButtonComponent path="/binarytodecimal" name="Binary To Decimal" icon={<FaFilePdf className="mr-3 text-blue-500" />} />

                                </div>

                                {/* MISC Section */}
                                <div>
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4">MISC</h3>
                                    <ButtonComponent path="/paypal" name="Paypal Link Gen." icon={<FaFilePdf className="mr-3 text-pink-500" />} />
                                    <ButtonComponent path="/beautifier" name="HTML Beautifier" icon={<FaFilePdf className="mr-3 text-pink-500" />} />
                                    <ButtonComponent path="/resumebuild" name="Resume Builder" icon={<FaFilePdf className="mr-3 text-pink-500" />} />
                                    <ButtonComponent path="/linkchecker" name="Website Link Checker" icon={<FaFilePdf className="mr-3 text-pink-500" />} />
                                    <ButtonComponent path="/wordcounter" name="Word Counter" icon={<FaFilePdf className="mr-3 text-pink-500" />} />
                                    <ButtonComponent path="/trafficchecker" name="Traffic Checker" icon={<FaFilePdf className="mr-3 text-pink-500" />} />

                                </div>
                            </div>
                        ) : (
                            <div className='relative Z-10'>
                                {/* Render Grid View */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">PDF</h3>
                                    <GridComponent path="/imagetopdf" name="Image To Pdf" icon={<FaFilePdf className="text-red-500" />} />
                                    <GridComponent path="/splitpdf" name="Split Pdf" icon={<FaScissors className="text-blue-500" />} />
                                    <GridComponent path="/compress" name="Compress Pdf" icon={<FaCompress className="text-red-500" />} />
                                    <GridComponent path="/mergepdf" name="Merge Pdf" icon={<AiOutlineMergeCells className="text-blue-500" />} />
                                    <GridComponent path="/pdfconverter" name="Word To Pdf" icon={<AiFillFileText className="text-red-600" />} />
                                    <GridComponent path="/searchpdf" name="Search Excel" icon={<FaFilePdf className="text-red-500" />} />
                                    {/* <GridComponent path="/searchexcelpdf" name="Search Pdf" icon={<FaFilePdf className="text-red-500" />} /> */}
                                    <GridComponent path="/editpdf" name="Edit Pdf" icon={<FaEdit className="text-green-500" />} />
                                    <GridComponent path="/extractpages" name="Extract page" icon={<FaStream className="text-blue-800" />} />
                                    <GridComponent path="/pdfcropper" name="Pdf Cropper" icon={<FaCropAlt className="text-green-300" />} />
                                    <GridComponent path="/addpagenum" name="Add page No." icon={<AiOutlineNumber className="text-green-300" />} />
                                    <GridComponent path="/protect" name="Protect Pdf" icon={<FaLock className="text-pink-700" />} />
                                    <GridComponent path="/unlockpdf" name="Unlock Pdf" icon={<FaUnlockAlt className="text-pink-500" />} />
                                    <GridComponent path="/pdftoimage" name="Pdf To Image" icon={<FaFileImage className="text-yellow-500" />} />
                                    <GridComponent path="/pdftoword" name="Pdf To Word" icon={<FaFilePdf className="text-red-500" />} />
                                </div>

                                {/* TODO Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">TODO</h3>
                                    <GridComponent path="/grocery" name="Grocery List" icon={<FaTasks className="text-purple-500" />} />
                                    <GridComponent path="/bulkemailchecker" name="Email Checker" icon={<FaTasks className="text-purple-500" />} />
                                    <GridComponent path="/bulkemailsender" name="Email Sender" icon={<FaTasks className="text-purple-500" />} />
                                    <GridComponent path="/googlemap" name="Google Map Extractor" icon={<FaTasks className="text-purple-500" />} />
                                    <GridComponent path="/cardvalidation" name="Card Validator" icon={<FaTasks className="text-purple-500" />} />
                                    <GridComponent path="/cardgenerator" name="Card Generator" icon={<FaTasks className="text-purple-500" />} />
                                    <GridComponent path="/templategenerator" name="Html Template Generator" icon={<FaTasks className="text-purple-500" />} />
                                    <GridComponent path="/phoneNumberFormat" name="Phone number Formatter" icon={<FaTasks className="text-purple-500" />} />
                                    <GridComponent path="/randompassword" name="Random Password Gen." icon={<FaTasks className="text-purple-500" />} />
                                    <GridComponent path="/linkedinscraper" name="Linkedin Scraper" icon={<FaTasks className="text-purple-500" />} />
                                </div>

                                {/* Calculator Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">CALCULATOR</h3>
                                    <GridComponent path="/calculator" name="Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/percentage" name="% Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/bmi" name="BMI Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/scientific" name="Scientific Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/compareloan" name="Compare Loan" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/currencyconverter" name="Currency Converter" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/fractioncalculator" name="Fraction calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/averagecalculator" name="Average calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/lcm" name="LCM calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/agecalculator" name="Age calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/datediffcalculator" name="Date Difference calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/compoundintrest" name="Compound Interest Calcu." icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/simpleinterest" name="Simple Interest Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/discountcalculator" name="Discount Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/gstcalculator" name="GST Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/vatcalculator" name="VAT Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/electricitybill" name="Electricity bill Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                    <GridComponent path="/testscorecalculator" name="Test Score Calculator" icon={<FaCalculator className="text-teal-500" />} />
                                </div>

                                {/* Converter Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">CONVERTER</h3>
                                    <GridComponent path="/faren-to-celcius" name="Fahren to Celsius" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/second" name="Seconds to Hour" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/hours" name="Hour to Second" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/texttospeech" name="Text To Speech" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/speechtotext" name="Speech To Text" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/onlinevoiceRecorder" name="Online Voice Recorder" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/onlinescreenRecorder" name="Online Screen Recorder" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/onlinescreenshot" name="Online ScreenShot" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/onlinewebcamtest" name="Online Webcam Test" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/calendar" name="Calendar" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/clock" name="Clock" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/stopwatch" name="StopWatch" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/timer" name="Countdown Timer" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/alarm" name="Alarm Clock" icon={<FaFilePdf className="text-blue-500" />} />
                                    <GridComponent path="/binarytodecimal" name="Binary To Decimal" icon={<FaFilePdf className="text-blue-500" />} />
                                </div>

                                {/* Misc Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    <h3 className="font-semibold text-lg text-neutral-600 text-left mb-4 pl-4 col-span-full">MISC</h3>
                                    <GridComponent path="/paypal" name="Paypal Link Gen." icon={<FaFilePdf className="text-pink-500" />} />
                                    <GridComponent path="/beautifier" name="HTML Beautifier" icon={<FaFilePdf className="text-pink-500" />} />
                                    <GridComponent path="/resumebuild" name="Resume Builder" icon={<FaFilePdf className="text-pink-500" />} />
                                    <GridComponent path="/linkchecker" name="Link Checker" icon={<FaFilePdf className="text-pink-500" />} />
                                    <GridComponent path="/wordcounter" name="Word Counter" icon={<FaFilePdf className="text-pink-500" />} />
                                    <GridComponent path="/trafficchecker" name="Traffic Checker" icon={<FaFilePdf className="text-pink-500" />} />
                                    
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewTab;
