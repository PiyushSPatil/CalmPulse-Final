import { motion } from "framer-motion";
import { AlertTriangle, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CrisisAlert() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-6 border-2 border-soft-rose/50 text-center space-y-4"
    >
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-soft-rose flex items-center justify-center">
          <Heart className="w-7 h-7 text-soft-rose-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground">You are not alone — help is available</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        We've noticed some of your responses suggest you may be going through a tough time. 
        It's okay to ask for help, and we're here to connect you with support.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <Button className="gap-2 rounded-xl">
          <Phone className="w-4 h-4" />
          Request Counselor Support
        </Button>
        <Button variant="outline" className="gap-2 rounded-xl">
          <AlertTriangle className="w-4 h-4" />
          Crisis Helpline
        </Button>
      </div>
    </motion.div>
  );
}
