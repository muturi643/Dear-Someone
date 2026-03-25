import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Send, 
  Archive, 
  ChevronRight, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Share2, 
  ArrowLeft,
  Sparkles,
  Zap,
  BookOpen,
  PenTool,
  Smartphone,
  Twitter,
  Facebook,
  Copy,
  Trash2,
  Check,
  Download
} from 'lucide-react';
import { AppState, LetterData, Intent, Tone, LetterTemplate } from './types';
import { generateCompliments, generateLetter, refineLetter } from './lib/gemini';

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  loading = false
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; 
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}) => {
  const base = "px-6 py-3 rounded-full font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-container shadow-lg",
    secondary: "bg-secondary text-white hover:opacity-90 shadow-md",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/10"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : children}
    </button>
  );
};

const Card = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-3xl p-6 shadow-sm border border-primary/5 ${className} ${onClick ? 'cursor-pointer' : ''}`}
  >
    {children}
  </div>
);

// --- Phases ---

const LandingPage = ({ onStart, onArchive }: { onStart: () => void; onArchive: () => void }) => (
  <div className="max-w-4xl mx-auto px-6 py-12 space-y-24">
    {/* Hero */}
    <section className="text-center space-y-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-fixed text-secondary text-sm font-semibold tracking-wider uppercase"
      >
        <Sparkles className="w-4 h-4" />
        Ink & Soul
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-6xl md:text-8xl font-serif tracking-tight leading-tight"
      >
        Dear <br /> <span className="italic text-secondary">Someone</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl text-primary/70 max-w-2xl mx-auto font-sans"
      >
        Bridge the gap from crushing to committing. We write heartfelt letters for the modern romantic.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Button onClick={onStart} className="w-full sm:w-auto text-lg px-10 py-4">
          Draft a Letter <ChevronRight className="w-5 h-5" />
        </Button>
        <Button onClick={onArchive} variant="outline" className="w-full sm:w-auto text-lg px-10 py-4">
          View Archive <Archive className="w-5 h-5" />
        </Button>
      </motion.div>
    </section>

    {/* Three-Phase Loop */}
    <section className="grid md:grid-cols-3 gap-8">
      {[
        { icon: <Zap className="w-6 h-6" />, title: "Discovery", desc: "Sharing the core intent and the 'Special Sauce' that makes your bond unique." },
        { icon: <Sparkles className="w-6 h-6" />, title: "Generation", desc: "A compliment shower followed by the crafting of your heartfelt letter." },
        { icon: <Smartphone className="w-6 h-6" />, title: "Review", desc: "WhatsApp-optimized delivery with fine-tuned emotional controls." }
      ].map((item, i) => (
        <Card key={i} className="space-y-4 hover:border-secondary/30 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-secondary-fixed text-secondary flex items-center justify-center">
            {item.icon}
          </div>
          <h3 className="text-2xl font-serif font-bold">{item.title}</h3>
          <p className="text-primary/60">{item.desc}</p>
        </Card>
      ))}
    </section>

    {/* Built for Vulnerability */}
    <section className="bg-primary text-white rounded-[3rem] p-12 md:p-20 text-center space-y-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-secondary blur-3xl" />
      </div>
      <h2 className="text-4xl md:text-6xl font-serif italic relative z-10">Built for Vulnerability.</h2>
      <p className="text-xl text-white/70 max-w-2xl mx-auto relative z-10">
        We believe the most powerful thing you can do is tell someone exactly how you feel. No games, just high-impact honesty.
      </p>
      <div className="pt-8 relative z-10">
        <Button onClick={onStart} variant="secondary" className="mx-auto text-lg px-10 py-4">
          Start Your Move
        </Button>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-primary/10 pt-12 pb-24 text-center space-y-4">
      <div className="font-serif italic text-2xl">Dear Someone</div>
      <p className="text-primary/40 text-sm uppercase tracking-widest">© 2026 Ink & Soul</p>
    </footer>
  </div>
);

const DiscoveryPhase = ({ 
  onNext, 
  onBack, 
  data, 
  setData 
}: { 
  onNext: () => void; 
  onBack: () => void; 
  data: Partial<LetterData>; 
  setData: (d: Partial<LetterData>) => void;
}) => {
  const intents: Intent[] = ['Safety Net', 'The Move', 'The Proposal'];
  const tones: Tone[] = ['Poetic', 'Casual', 'Sincere', 'Playful'];
  const templates: LetterTemplate[] = ['None', 'Apology', 'Gratitude', 'Thinking of You'];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-12">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-primary/5 text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-serif italic">Phase 1: Discovery</h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-primary/50">Recipient Name</label>
          <input 
            type="text" 
            placeholder="Who is this for?"
            className="w-full bg-white border-b-2 border-primary/10 focus:border-secondary py-4 text-2xl font-serif outline-none transition-colors"
            value={data.recipientName || ''}
            onChange={(e) => setData({ ...data, recipientName: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-primary/50">Core Intent</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {intents.map(intent => (
              <button
                key={intent}
                onClick={() => setData({ ...data, intent })}
                className={`px-4 py-3 rounded-2xl border-2 transition-all text-left space-y-1 ${
                  data.intent === intent 
                    ? 'border-secondary bg-secondary-fixed text-secondary' 
                    : 'border-primary/5 bg-white hover:border-primary/20'
                }`}
              >
                <div className="font-bold">{intent}</div>
                <div className="text-xs opacity-70">
                  {intent === 'Safety Net' && 'Checking in'}
                  {intent === 'The Move' && 'Asking out'}
                  {intent === 'The Proposal' && 'Deep commitment'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-primary/50">Optional Template</label>
          <div className="flex flex-wrap gap-2">
            {templates.map(template => (
              <button
                key={template}
                onClick={() => setData({ ...data, template })}
                className={`px-6 py-2 rounded-full border-2 transition-all ${
                  (data.template || 'None') === template 
                    ? 'border-secondary bg-secondary-fixed text-secondary' 
                    : 'border-primary/10 hover:border-primary/30'
                }`}
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-primary/50">The Special Sauce</label>
          <textarea 
            placeholder="A shared memory, an inside joke, or that one thing they do that drives you crazy in a good way..."
            className="w-full bg-white border-2 border-primary/5 rounded-3xl p-6 h-40 font-sans outline-none focus:border-secondary transition-colors resize-none"
            value={data.specialSauce || ''}
            onChange={(e) => setData({ ...data, specialSauce: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold uppercase tracking-widest text-primary/50">Communication Tone</label>
          <div className="flex flex-wrap gap-2">
            {tones.map(tone => (
              <button
                key={tone}
                onClick={() => setData({ ...data, tone })}
                className={`px-6 py-2 rounded-full border-2 transition-all ${
                  data.tone === tone 
                    ? 'border-primary bg-primary text-white' 
                    : 'border-primary/10 hover:border-primary/30'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-8">
          <Button 
            onClick={onNext} 
            className="w-full py-5 text-xl"
            disabled={!data.recipientName || !data.intent || !data.specialSauce || !data.tone}
          >
            Enter the Compliment Shower <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const GenerationPhase = ({ 
  onNext, 
  onBack, 
  data, 
  setData 
}: { 
  onNext: () => void; 
  onBack: () => void; 
  data: Partial<LetterData>; 
  setData: (d: Partial<LetterData>) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const compliments = await generateCompliments(
        data.recipientName!,
        data.specialSauce!,
        data.tone!
      );
      const letter = await generateLetter(
        data.recipientName!,
        data.intent!,
        data.specialSauce!,
        data.tone!,
        data.template || 'None'
      );
      setData({ ...data, compliments, letterContent: letter });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data.letterContent) {
      handleGenerate();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-primary/5 text-primary">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-serif italic">Phase 2: Generation</h2>
        </div>
        <Button variant="ghost" onClick={handleGenerate} loading={loading}>
          <RefreshCw className="w-4 h-4" /> Regenerate
        </Button>
      </div>

      <div className="space-y-12">
        {/* Compliment Shower */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-sm">
            <Zap className="w-4 h-4" /> The Compliment Shower
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-white/50 animate-pulse rounded-3xl border border-primary/5" />
              ))
            ) : (
              data.compliments?.map((comp, i) => (
                <Card key={i} className="flex items-center justify-center text-center italic font-serif text-lg p-8 bg-secondary-fixed/30 border-secondary/10">
                  "{comp}"
                </Card>
              ))
            )}
          </div>
        </section>

        {/* The Heartfelt Letter */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm">
              <BookOpen className="w-4 h-4" /> Your Heartfelt Letter
            </div>
            <button 
              onClick={() => setIsLocked(!isLocked)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity"
            >
              {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              {isLocked ? 'Locked' : 'Unlocked'}
            </button>
          </div>

          <div className="relative group">
            <div className={`bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-primary/5 min-h-[400px] transition-all duration-700 ${isLocked ? 'blur-md select-none' : ''}`}>
              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-primary/5 w-3/4 animate-pulse rounded" />
                  <div className="h-4 bg-primary/5 w-full animate-pulse rounded" />
                  <div className="h-4 bg-primary/5 w-5/6 animate-pulse rounded" />
                  <div className="h-4 bg-primary/5 w-2/3 animate-pulse rounded" />
                </div>
              ) : (
                <div className="prose prose-primary max-w-none font-serif text-xl leading-relaxed whitespace-pre-wrap">
                  {data.letterContent}
                </div>
              )}
            </div>
            
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Button onClick={() => setIsLocked(false)} variant="secondary" className="shadow-2xl px-8 py-4">
                  <Unlock className="w-5 h-5" /> Reveal Letter
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Refinement Controls */}
        {!isLocked && !loading && (
          <section className="flex flex-wrap items-center justify-center gap-3">
            {['Deeper', 'Funnier', 'Shorter', 'Surprise Me'].map((type) => (
              <button
                key={type}
                onClick={async () => {
                  setLoading(true);
                  const refined = await refineLetter(data.letterContent!, type as any);
                  setData({ ...data, letterContent: refined });
                  setLoading(false);
                }}
                className="px-6 py-2 rounded-full border border-primary/10 hover:border-secondary hover:text-secondary transition-all text-sm font-bold uppercase tracking-widest"
              >
                {type}
              </button>
            ))}
          </section>
        )}

        <div className="pt-8">
          <Button 
            onClick={onNext} 
            className="w-full py-5 text-xl"
            disabled={isLocked || loading}
          >
            Finalize for WhatsApp <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ReviewPhase = ({ 
  onNext, 
  onBack, 
  data, 
  setData 
}: { 
  onNext: () => void; 
  onBack: () => void; 
  data: Partial<LetterData>; 
  setData: (d: Partial<LetterData>) => void;
}) => {
  const [vulnerability, setVulnerability] = useState(data.vulnerability || 50);
  const [professionalism, setProfessionalism] = useState(data.professionalism || 50);
  const [nostalgia, setNostalgia] = useState(data.nostalgia || 50);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAdjust = async () => {
    setLoading(true);
    try {
      const letter = await generateLetter(
        data.recipientName!,
        data.intent!,
        data.specialSauce!,
        data.tone!,
        data.template || 'None',
        vulnerability,
        professionalism,
        nostalgia
      );
      setData({ ...data, letterContent: letter, vulnerability, professionalism, nostalgia });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(data.letterContent || '');
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(data.letterContent || '');
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    const url = window.location.href; // Facebook sharing usually works better with URLs
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(data.letterContent || '')}`, '_blank');
  };

  const handleCopy = () => {
    if (data.letterContent) {
      navigator.clipboard.writeText(data.letterContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (data.letterContent) {
      const element = document.createElement("a");
      const file = new Blob([data.letterContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `Letter_for_${data.recipientName || 'Recipient'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const charCount = data.letterContent?.length || 0;
  const vulnerabilityScore = (vulnerability + (100 - professionalism) + nostalgia) / 3;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-12">
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-primary/5 text-primary">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-serif italic">Phase 3: Review</h2>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-40">
            {charCount} Characters
          </div>
        </div>

        {/* Vulnerability Gauge */}
        <div className="bg-primary text-white p-8 rounded-[2rem] space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Emotional Intensity</div>
              <div className="text-3xl font-serif italic">
                {vulnerabilityScore < 30 && 'Subtle & Poised'}
                {vulnerabilityScore >= 30 && vulnerabilityScore < 60 && 'Warm & Sincere'}
                {vulnerabilityScore >= 60 && vulnerabilityScore < 85 && 'Deeply Vulnerable'}
                {vulnerabilityScore >= 85 && 'Soul-Baring'}
              </div>
            </div>
            <div className="text-4xl font-serif italic opacity-20">{Math.round(vulnerabilityScore)}%</div>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${vulnerabilityScore}%` }}
              className="h-full bg-secondary"
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-8 bg-white p-8 rounded-[2rem] border border-primary/5 shadow-sm">
          {[
            { label: 'Vulnerability', value: vulnerability, setter: setVulnerability },
            { label: 'Professionalism', value: professionalism, setter: setProfessionalism },
            { label: 'Nostalgia', value: nostalgia, setter: setNostalgia }
          ].map((slider) => (
            <div key={slider.label} className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold uppercase tracking-widest text-primary/50">{slider.label}</label>
                <span className="text-secondary font-bold">{slider.value}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={slider.value}
                onChange={(e) => slider.setter(parseInt(e.target.value))}
                onMouseUp={handleAdjust}
                className="w-full h-2 bg-primary/5 rounded-lg appearance-none cursor-pointer accent-secondary"
              />
            </div>
          ))}
          <p className="text-xs text-primary/40 italic">Adjusting sliders will automatically refine the letter's prose.</p>
        </div>

        <div className="space-y-4">
          <Button onClick={handleShareWhatsApp} className="w-full py-5 text-xl bg-[#25D366] border-none hover:bg-[#128C7E]">
            <Share2 className="w-6 h-6" /> Share to WhatsApp
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleShareTwitter} variant="outline" className="py-4 border-sky-400 text-sky-500 hover:bg-sky-50 hover:text-sky-600">
              <Twitter className="w-5 h-5" /> Twitter
            </Button>
            <Button onClick={handleShareFacebook} variant="outline" className="py-4 border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
              <Facebook className="w-5 h-5" /> Facebook
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleCopy} variant="ghost" className="py-4 border border-dashed border-primary/20">
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </Button>
            <Button onClick={handleDownload} variant="ghost" className="py-4 border border-dashed border-primary/20">
              <Download className="w-5 h-5" /> Download
            </Button>
          </div>

          <Button onClick={onNext} variant="primary" className="w-full py-5 text-xl">
            <Archive className="w-6 h-6" /> Save to Archive
          </Button>
        </div>
      </div>

      {/* Phone Mockup */}
      <div className="flex items-center justify-center">
        <div className="w-[320px] h-[640px] bg-primary rounded-[3rem] p-4 shadow-2xl relative border-[8px] border-primary-container">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-primary rounded-b-2xl z-20" />
          <div className="bg-[#E5DDD5] w-full h-full rounded-[2rem] overflow-hidden flex flex-col">
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] p-4 pt-8 flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-full bg-white/20" />
              <div className="font-bold">{data.recipientName}</div>
            </div>
            {/* Chat Area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {loading ? (
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%] animate-pulse">
                  <div className="h-4 bg-primary/5 w-full rounded mb-2" />
                  <div className="h-4 bg-primary/5 w-2/3 rounded" />
                </div>
              ) : (
                data.letterContent?.split('\n\n').map((block, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] text-sm font-sans"
                  >
                    {block}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArchivePage = ({ 
  history, 
  onBack,
  onSelect,
  onDelete
}: { 
  history: LetterData[]; 
  onBack: () => void;
  onSelect: (l: LetterData) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-primary/5 text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-serif italic">The Archive</h2>
      </div>
      {history.length > 0 && (
        <div className="text-xs font-bold uppercase tracking-widest opacity-40">
          {history.length} {history.length === 1 ? 'Letter' : 'Letters'}
        </div>
      )}
    </div>

    {history.length === 0 ? (
      <div className="text-center py-24 space-y-4">
        <Archive className="w-12 h-12 mx-auto text-primary/10" />
        <p className="text-primary/40 font-serif italic text-xl">Your letter collection is empty.</p>
        <Button variant="outline" onClick={onBack} className="mx-auto">
          Go Back
        </Button>
      </div>
    ) : (
      <div className="grid gap-4">
        {history.map((letter) => (
          <Card 
            key={letter.id} 
            className="flex items-center justify-between hover:border-secondary/30 cursor-pointer group" 
            onClick={() => onSelect(letter)}
          >
            <div className="space-y-1">
              <div className="font-serif text-xl font-bold group-hover:text-secondary transition-colors">{letter.recipientName}</div>
              <div className="text-xs font-bold uppercase tracking-widest opacity-40">
                {letter.intent} • {new Date(letter.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                letter.status === 'Sent' ? 'bg-green-100 text-green-700' : 'bg-primary/5 text-primary/50'
              }`}>
                {letter.status}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(letter.id);
                }}
                className="p-2 rounded-full hover:bg-red-50 text-primary/20 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <ChevronRight className="w-5 h-5 text-primary/20 group-hover:text-secondary transition-colors" />
            </div>
          </Card>
        ))}
      </div>
    )}
  </div>
);

// --- Main App ---

export default function App() {
  const [state, setState] = useState<AppState>({
    currentPhase: 'landing',
    currentLetter: {
      vulnerability: 50,
      professionalism: 50,
      nostalgia: 50
    },
    history: []
  });

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dear_someone_history');
    if (saved) {
      setState(prev => ({ ...prev, history: JSON.parse(saved) }));
    }
  }, []);

  const saveToArchive = () => {
    const newLetter: LetterData = {
      ...state.currentLetter as LetterData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'Draft'
    };
    const newHistory = [newLetter, ...state.history];
    setState(prev => ({
      ...prev,
      history: newHistory,
      currentPhase: 'archive',
      currentLetter: {}
    }));
    localStorage.setItem('dear_someone_history', JSON.stringify(newHistory));
    
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#141414', '#F27D26', '#FFFFFF']
    });
  };

  const deleteFromArchive = (id: string) => {
    const newHistory = state.history.filter(l => l.id !== id);
    setState(prev => ({ ...prev, history: newHistory }));
    localStorage.setItem('dear_someone_history', JSON.stringify(newHistory));
  };

  const phases = ['landing', 'discovery', 'generation', 'review'];
  const currentPhaseIndex = phases.indexOf(state.currentPhase);

  return (
    <div className="min-h-screen bg-surface font-sans selection:bg-secondary-fixed selection:text-secondary">
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between border-b border-primary/5 sticky top-0 bg-surface/80 backdrop-blur-md z-50">
        <div 
          className="font-serif italic text-2xl cursor-pointer hover:text-secondary transition-colors"
          onClick={() => setState(prev => ({ ...prev, currentPhase: 'landing' }))}
        >
          Dear Someone
        </div>
        
        {/* Progress Indicator */}
        {currentPhaseIndex > 0 && (
          <div className="hidden md:flex items-center gap-2">
            {phases.slice(1).map((p, i) => (
              <div key={p} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${i <= currentPhaseIndex - 1 ? 'bg-secondary w-6' : 'bg-primary/10'}`} />
                {i < phases.length - 2 && <div className="w-4 h-[1px] bg-primary/5" />}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setState(prev => ({ ...prev, currentPhase: 'archive' }))}
            className="p-2 rounded-full hover:bg-primary/5 text-primary transition-colors"
          >
            <Archive className="w-6 h-6" />
          </button>
          <Button 
            variant="primary" 
            className="hidden sm:flex"
            onClick={() => setState(prev => ({ ...prev, currentPhase: 'discovery', currentLetter: {} }))}
          >
            <PenTool className="w-4 h-4" /> New Letter
          </Button>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {state.currentPhase === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LandingPage 
                onStart={() => setState(prev => ({ ...prev, currentPhase: 'discovery' }))}
                onArchive={() => setState(prev => ({ ...prev, currentPhase: 'archive' }))}
              />
            </motion.div>
          )}

          {state.currentPhase === 'discovery' && (
            <motion.div
              key="discovery"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DiscoveryPhase 
                data={state.currentLetter}
                setData={(d) => setState(prev => ({ ...prev, currentLetter: d }))}
                onNext={() => setState(prev => ({ ...prev, currentPhase: 'generation' }))}
                onBack={() => setState(prev => ({ ...prev, currentPhase: 'landing' }))}
              />
            </motion.div>
          )}

          {state.currentPhase === 'generation' && (
            <motion.div
              key="generation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GenerationPhase 
                data={state.currentLetter}
                setData={(d) => setState(prev => ({ ...prev, currentLetter: d }))}
                onNext={() => setState(prev => ({ ...prev, currentPhase: 'review' }))}
                onBack={() => setState(prev => ({ ...prev, currentPhase: 'discovery' }))}
              />
            </motion.div>
          )}

          {state.currentPhase === 'review' && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ReviewPhase 
                data={state.currentLetter}
                setData={(d) => setState(prev => ({ ...prev, currentLetter: d }))}
                onNext={saveToArchive}
                onBack={() => setState(prev => ({ ...prev, currentPhase: 'generation' }))}
              />
            </motion.div>
          )}

          {state.currentPhase === 'archive' && (
            <motion.div
              key="archive"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ArchivePage 
                history={state.history}
                onBack={() => setState(prev => ({ ...prev, currentPhase: 'landing' }))}
                onSelect={(l) => setState(prev => ({ ...prev, currentLetter: l, currentPhase: 'review' }))}
                onDelete={deleteFromArchive}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
