import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Tabs({ tabs, defaultTab, onChange }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabClick = (id) => {
    setActiveTab(id)
    onChange?.(id)
  }

  return (
    <div className="w-full">
      <div className="flex overflow-x-auto border-b border-white/10 pb-px scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                isActive ? 'text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
      
      <div className="pt-6">
        {tabs.find(t => t.id === activeTab)?.content}
      </div>
    </div>
  )
}
