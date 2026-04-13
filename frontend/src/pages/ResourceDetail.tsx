import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const resources = [
  {
    icon: "Wind",
    title: "Box Breathing",
    desc: "A simple 4-4-4-4 technique to calm your nervous system in seconds.",
    category: "Breathing",
    color: "bg-calm-blue text-calm-blue-foreground",
    instructions: "1. Inhale slowly through your nose for 4 seconds.\n2. Hold your breath for 4 seconds.\n3. Exhale slowly through your mouth for 4 seconds.\n4. Hold your breath for 4 seconds.\nRepeat 4-5 times or until you feel calmer.",
    videoUrl: "https://www.youtube.com/watch?v=4Lb5L-VEm34",
    slug: "box-breathing"
  },
  {
    icon: "Brain",
    title: "Grounding Exercise",
    desc: "5-4-3-2-1 sensory exercise to bring you back to the present moment.",
    category: "Mindfulness",
    color: "bg-lavender text-lavender-foreground",
    instructions: "1. Name 5 things you can see.\n2. Name 4 things you can touch.\n3. Name 3 things you can hear.\n4. Name 2 things you can smell.\n5. Name 1 thing you can taste.\nThis helps anchor you in the present.",
    videoUrl: "https://www.youtube.com/watch?v=ZToicYcHIOU",
    slug: "grounding-exercise"
  },
  {
    icon: "Heart",
    title: "Self-Compassion Journal",
    desc: "Write three kind things to yourself to build emotional resilience.",
    category: "Journaling",
    color: "bg-soft-rose text-soft-rose-foreground",
    instructions: "1. Think of a recent challenge or mistake.\n2. Write three kind, understanding statements to yourself, as you would to a friend.\n3. Reflect on how this changes your perspective.\nExample: 'I did my best with what I knew at the time.'",
    slug: "self-compassion-journal"
  },
  {
    icon: "Dumbbell",
    title: "Desk Stretches",
    desc: "Quick 5-minute stretch routine to release tension during study sessions.",
    category: "Physical",
    color: "bg-soft-green text-soft-green-foreground",
    instructions: "1. Neck rolls: Gently roll your head in circles 5 times each direction.\n2. Shoulder shrugs: Lift shoulders to ears, hold 5 seconds, release.\n3. Wrist stretches: Extend arms, pull fingers back gently.\n4. Seated twist: Twist torso gently to each side.\n5. Deep breathing: Take 5 slow breaths.",
    videoUrl: "https://www.youtube.com/watch?v=2pLT-olgUJs",
    slug: "desk-stretches"
  },
  {
    icon: "Music",
    title: "Calm Playlist",
    desc: "Curated lo-fi and nature sounds to help you focus and relax.",
    category: "Audio",
    color: "bg-warm-amber text-warm-amber-foreground",
    instructions: "Listen to calming music or nature sounds for 10-15 minutes. Focus on the rhythm and let your mind relax. Recommended: Rain sounds, soft piano, or ambient nature recordings. Use headphones for best effect.",
    videoUrl: "https://www.youtube.com/watch?v=5qap5aO4i9A",
    slug: "calm-playlist"
  },
  {
    icon: "Leaf",
    title: "Progressive Relaxation",
    desc: "Tense and release each muscle group to melt away physical stress.",
    category: "Relaxation",
    color: "bg-calm-blue text-calm-blue-foreground",
    instructions: "1. Start with your toes: Tense for 5 seconds, then release.\n2. Move up to feet, calves, thighs, etc.\n3. Continue through abdomen, chest, arms, neck, and face.\n4. Notice the difference between tension and relaxation.\nTake 10-15 minutes for the full body.",
    videoUrl: "https://www.youtube.com/watch?v=lFcSrYw-ARY",
    slug: "progressive-relaxation"
  },
];

function getYouTubeEmbedUrl(videoUrl: string) {
  try {
    const url = new URL(videoUrl);
    const hostname = url.hostname.replace('www.', '');

    if (hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${url.pathname.slice(1)}`;
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      const id = url.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'embed' && pathParts[1]) return `https://www.youtube.com/embed/${pathParts[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function ResourceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const resource = resources.find(r => r.slug === slug);
  const embedUrl = resource?.videoUrl ? getYouTubeEmbedUrl(resource.videoUrl) : null;

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Redirect in progress, don't render
  if (!user) {
    return null;
  }

  if (!resource) {
    return <div>Resource not found</div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Button variant="ghost" onClick={() => navigate('/resources')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resources
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{resource.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{resource.desc}</p>
        <span className="inline-block text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground mt-2">{resource.category}</span>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-foreground mb-4">How to do it:</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{resource.instructions}</p>
      </motion.div>

      {resource.videoUrl && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="glass rounded-2xl p-6">
          <h2 className="font-semibold text-foreground mb-4">Guided Video:</h2>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={resource.title}
              className="w-full h-64 rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <a href={resource.videoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
              Watch the guided video on YouTube
            </a>
          )}
        </motion.div>
      )}
    </div>
  );
}