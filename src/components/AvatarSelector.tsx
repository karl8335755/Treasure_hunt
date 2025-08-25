import { useState } from 'react';
import { type AvatarId, AVATARS } from '../types';

interface AvatarSelectorProps {
  currentAvatar: AvatarId;
  onAvatarChange: (avatarId: AvatarId) => void;
}

export function AvatarSelector({ currentAvatar, onAvatarChange }: AvatarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Current Avatar Display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-3 lg:p-4 border-2 border-purple-400/50 hover:border-purple-400 transition-all duration-200 hover:scale-105 w-24 h-24 lg:w-32 lg:h-32 flex flex-col items-center justify-center group"
      >
        <div className="text-3xl lg:text-4xl mb-1 lg:mb-2 group-hover:scale-110 transition-transform duration-200">
          {AVATARS[currentAvatar].emoji}
        </div>
        <div className="text-purple-300 font-bold text-xs lg:text-sm text-center">{AVATARS[currentAvatar].name}</div>
        <div className="text-purple-200 text-xs text-center">Click to change</div>
      </button>

      {/* Avatar Selection Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-black/90 rounded-xl border-2 border-purple-400/50 p-3 lg:p-4 z-50 min-w-64 lg:min-w-80">
          <div className="text-purple-300 font-bold text-center mb-3">Choose Your Avatar</div>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(AVATARS) as AvatarId[]).map((avatarId) => (
              <button
                key={avatarId}
                onClick={() => {
                  onAvatarChange(avatarId);
                  setIsOpen(false);
                }}
                className={`p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  avatarId === currentAvatar
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                    : 'bg-gray-800/50 border-gray-600 hover:border-purple-400 text-gray-300 hover:text-purple-200'
                }`}
              >
                <div className="text-2xl mb-1">{AVATARS[avatarId].emoji}</div>
                <div className="font-bold text-sm">{AVATARS[avatarId].name}</div>
                <div className="text-xs opacity-80">{AVATARS[avatarId].description}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
