import React from 'react'
import { Link } from 'react-router-dom'
import { FaFilePdf, FaTasks, FaCalculator } from 'react-icons/fa';

const ButtonComponent = ({path,name,icon}) => {
    return (
        <div>
            <Link to={path} className="block bg-red mb-2">
                <button className="flex items-center justify-start bg-white border border-blue-500/20 p-4 transition-all rounded-lg shadow-sm hover:border-blue-300 w-full">
                    {icon}
                    {name}
                </button>
            </Link>
        </div>
    )
}

export default ButtonComponent
