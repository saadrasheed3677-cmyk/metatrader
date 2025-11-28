/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { SystemLayer } from '../types';
import { ArrowUpRight, Activity } from 'lucide-react';
import { audioManager } from '../services/audioService';

interface LayerCardProps {
  layer: SystemLayer;
  onClick: () => void;
}

const ArtistCard: React.FC<LayerCardProps> = ({ layer, onClick }) => {
  return (
    <motion.div
      className="group relative h-[400px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-white/10 bg-black cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
      onMouseEnter={audioManager.playHover}
    >
      {/* Image Background with Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          src={layer.image} 
          alt={layer.title} 
          className="h-full w-full object-cover grayscale will-change-transform opacity-50"
          variants={{
            rest: { scale: 1, opacity: 0.4, filter: 'grayscale(100%)' },
            hover: { scale: 1.05, opacity: 0.8, filter: 'grayscale(0%)' }
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-[#4fb7b3]/10 transition-colors duration-500" />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <span className="text-xs font-mono border border-white/30 px-2 py-1 rounded-sm backdrop-blur-md text-[#a8fbd3]">
             LAYER {layer.tag}
           </span>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 20, y: -20 },
               hover: { opacity: 1, x: 0, y: 0 }
             }}
             className="bg-white text-black rounded-full p-2 will-change-transform"
           >
             <ArrowUpRight className="w-6 h-6" />
           </motion.div>
        </div>

        <div>
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-2xl md:text-3xl font-bold uppercase text-white mix-blend-difference will-change-transform leading-tight"
              variants={{
                rest: { y: 0 },
                hover: { y: -5 }
              }}
              transition={{ duration: 0.4 }}
            >
              {layer.title}
            </motion.h3>
          </div>
          <motion.div 
            className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#4fb7b3] mt-2 will-change-transform"
            variants={{
              rest: { opacity: 0, y: 10 },
              hover: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Activity className="w-4 h-4" />
            {layer.subtitle}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtistCard;