
import { useState, useRef } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { useToast } from '@/hooks/use-toast';
import { X, User, Upload } from 'lucide-react';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPlayerModal = ({ isOpen, onClose }: AddPlayerModalProps) => {
  const { addPlayer, uploadImage } = useFirebase();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    position: '',
    photoURL: ''
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const positions = ['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center'];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Player name is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.number.trim()) {
      toast({
        title: "Missing Information",
        description: "Jersey number is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.position) {
      toast({
        title: "Missing Information",
        description: "Position is required.",
        variant: "destructive",
      });
      return;
    }

    // Validate number
    const jerseyNumber = parseInt(formData.number);
    if (isNaN(jerseyNumber) || jerseyNumber < 0 || jerseyNumber > 99) {
      toast({
        title: "Invalid Number",
        description: "Jersey number must be between 0 and 99.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let photoURL = formData.photoURL.trim();
      
      // Upload image if file is selected
      if (imageFile) {
        photoURL = await uploadImage(imageFile);
      }

      await addPlayer({
        name: formData.name.trim(),
        number: jerseyNumber,
        position: formData.position,
        photoURL: photoURL || undefined
      });
      
      toast({
        title: "Player Added",
        description: `${formData.name} has been added to the team.`,
      });
      
      // Reset form and close modal
      setFormData({ name: '', number: '', position: '', photoURL: '' });
      setImageFile(null);
      setImagePreview('');
      onClose();
    } catch (error) {
      console.error('Add player error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add player. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-md rounded-t-3xl p-6 transform transition-all duration-300 ease-out">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Player</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Preview */}
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {imagePreview || formData.photoURL ? (
                <img src={imagePreview || formData.photoURL} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </div>

          {/* Image Upload Options */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors flex items-center justify-center space-x-2"
            >
              <Upload className="w-5 h-5 text-gray-500" />
              <span className="text-gray-500">Upload Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <div className="text-center text-gray-400 text-sm">or</div>
            
            <input
              type="url"
              value={formData.photoURL}
              onChange={(e) => setFormData({ ...formData, photoURL: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter photo URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Player Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter player name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jersey Number *</label>
            <input
              type="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter jersey number"
              min="0"
              max="99"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full p-3 bg-gray-50 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select position</option>
              {positions.map((position) => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 active:scale-98 disabled:opacity-50 mt-6"
          >
            {loading ? 'Adding Player...' : 'Add Player'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlayerModal;
