
import { useState } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import PlayerCard from './PlayerCard';
import { Plus, Search } from 'lucide-react';

interface PlayersViewProps {
  onAddPlayer: () => void;
}

const PlayersView = ({ onAddPlayer }: PlayersViewProps) => {
  const { players } = useFirebase();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.number.toString().includes(searchTerm) ||
    player.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Players</h1>
        <button
          onClick={onAddPlayer}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg transition-all duration-200 active:scale-90"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      {/* Players List */}
      <div className="space-y-3">
        {filteredPlayers.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            showAttendance={false}
            showDelete={true}
          />
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No players found</div>
          <p className="text-gray-500">Try adjusting your search or add a new player</p>
        </div>
      )}
    </div>
  );
};

export default PlayersView;
