import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState('funny');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const generateCaption = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);
    formData.append('tone', tone);

    try {
      const res = await fetch('http://localhost:5000/api/caption', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setCaption(data.caption);
    } catch (err) {
      console.error('Error generating caption:', err);
      setCaption('Something went wrong. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-   [#302b63] to-[#24243e] text-white flex items-center justify-center    px-4 py-10 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient    (ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20    via-purple-900/10 to-transparent blur-3xl z-0" />

      <div className="relative z-10 backdrop-blur-lg bg-white/5 p-8     rounded-3xl border border-white/10 shadow-xl w-full max-w-5xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-center     text-indigo-300 mb-2 tracking-wide drop-shadow">
          CaptionCraft 🪄
        </h1>
        <p className="mb-8 text-zinc-300 text-center text-sm    sm:text-base max-w-3xl mx-auto">
          Upload an image, choose a tone, and let AI drop a 🔥 caption    for your feed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-4 py-3 bg-black/30 text-white    rounded-xl border border-zinc-600 cursor-pointer file:mr-4    file:py-2 file:px-4 file:rounded-full file:border-0    file:text-sm file:font-semibold file:bg-indigo-500   file:text-white hover:file:bg-indigo-600"
            />

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-3 bg-black/30 text-white    rounded-xl border border-zinc-600"
            >
              <option value="funny">Funny 😂</option>
              <option value="classic">Classic ✨</option>
              <option value="savage">Savage 😎</option>
              <option value="poetic">Poetic 🎭</option>
              <option value="quote">Quote 🎭</option>
              <option value="shayari">Shayari 🎭</option>
            </select>

            <button
              onClick={generateCaption}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white     px-6 py-3 rounded-xl w-full transition duration-300     ease-in-out shadow-md hover:shadow-indigo-500/50    disabled:opacity-50"
            >
              {loading ? 'Cooking Caption...' : 'Generate Caption'}
            </button>
          </div>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-96 object-cover rounded-xl    shadow-lg border border-zinc-700"
            />
          )}
        </div>
        
        {caption && (
          <div className="bg-black/40 p-6 mt-8 rounded-xl text-left     border border-zinc-600 space-y-2 shadow-inner">
            {(tone === 'funny' || tone === 'savage') ? (
              caption
                .split('**')
                .filter(line => line.trim())
                .map((chunk, i) => {
                  const isTitle = chunk.toLowerCase().includes('option');
                  const colorClass =
                    tone === 'funny'
                      ? 'text-pink-400'
                      : 'text-red-400'; // savage gets spicy red
                
                  return (
                    <p
                      key={i}
                      className={`${isTitle ? `font-semibold $    {colorClass}` : 'text-zinc-300'} leading-relaxed`}
                    >
                      {chunk.trim()}
                    </p>
                  );
                })
            ) : (
              <p className="text-lg italic text-center text-zinc-200">    “{caption}”</p>
            )}

            <button
              onClick={() => navigator.clipboard.writeText(caption)}
              className="mt-2 text-sm text-indigo-400 hover:underline     block text-center"
            >
              Copy Caption
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
