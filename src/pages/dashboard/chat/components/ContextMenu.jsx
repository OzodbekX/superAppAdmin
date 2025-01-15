import React, { useEffect, useRef } from 'react'

const ContextMenu = ({ x, y, options, contextMenuRef, closeMenu }) => {
  // Function to handle click events
  const handleClickOutside = (event) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
      closeMenu() // Close the dropdown or perform action when clicked outside
    }
  }

  useEffect(() => {
    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={contextMenuRef}
      className="absolute bg-white z-50 rounded-xl shadow-2xl"
      style={{
        top: y,
        left: x,
        boxShadow: '2px 7px 16px 0 rgba(41, 45, 52, 0.12)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onBlur={closeMenu}
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside the menu from propagating
    >
      {options.map((option, index) => (
        <div
          key={index}
          className="p-3 pr-5 text-black flex gap-4 cursor-pointer border-b-2 last:border-b-0"
          style={{ color: option.color }}
          onClick={(e) => {
            e.stopPropagation()
            option.onClick()
          }}
        >
          {option?.icon}
          {option.label}
        </div>
      ))}
    </div>
  )
}

export default ContextMenu
