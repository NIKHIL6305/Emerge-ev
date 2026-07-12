import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Zap, Battery, Cpu, TrendingUp, ShieldCheck, X } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface TechnologyViewProps {
  onBack: () => void;
}

export function TechnologyView({ onBack }: TechnologyViewProps) {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const articles = [
    {
      title: "Solid-State Batteries: The Next Frontier",
      source: "Nature Energy, 2024",
      description: "Recent breakthroughs in solid electrolyte interfaces promise to double energy density and eliminate fire risks in next-generation EVs.",
      icon: <Battery className="w-6 h-6 text-emerge-green" />,
      content: "Solid-state batteries represent a paradigm shift in energy storage technology for electric vehicles. By replacing the liquid or polymer gel electrolytes found in current lithium-ion batteries with a solid electrolyte, these batteries offer significant improvements in safety and energy density.\n\nRecent studies published in 2024 highlight novel composite solid electrolytes that mitigate dendrite formation, a major challenge in previous iterations. This allows for the use of lithium metal anodes, potentially doubling the energy density compared to conventional cells.\n\nFurthermore, the absence of flammable liquid electrolytes virtually eliminates the risk of thermal runaway, leading to much safer battery packs that require less complex cooling systems and casing, further reducing overall vehicle weight."
    },
    {
      title: "Ultra-Fast Charging Architecture",
      source: "IEEE Power Electronics, 2025",
      description: "Implementation of 800V+ architectures enabling 10-80% charge in under 10 minutes without significant battery degradation.",
      icon: <Zap className="w-6 h-6 text-emerge-green" />,
      content: "The transition from 400V to 800V and higher electrical architectures in electric vehicles is accelerating. This shift enables much faster charging times by allowing higher power transfer (kW) at the same or lower current levels, reducing heat generation in cables and connectors.\n\nLatest research focuses on the optimization of silicon carbide (SiC) inverters and advanced battery management systems (BMS) that can dynamically adjust charge rates based on real-time cell temperature and state of charge (SoC).\n\nThese advancements make it possible to add 200 miles of range in under 10 minutes, making EV charging comparable to traditional refueling experiences, while actively monitoring cell health to prevent long-term degradation from ultra-fast charging cycles."
    },
    {
      title: "AI-Driven Thermal Management",
      source: "Journal of Automotive Engineering, 2025",
      description: "Predictive thermal conditioning using machine learning algorithms increases winter range by up to 30%.",
      icon: <Cpu className="w-6 h-6 text-emerge-green" />,
      content: "Thermal management is critical for EV efficiency, particularly in extreme weather conditions. Traditional systems react to temperature changes, but new AI-driven approaches are predictive.\n\nBy leveraging machine learning algorithms that analyze route data, ambient weather forecasts, driving style, and traffic conditions, the vehicle can preemptively condition the battery and cabin.\n\nFor example, if the navigation system knows a fast-charging stop is approaching, the system can optimally pre-heat the battery to the ideal temperature for maximum charge acceptance upon arrival. In winter conditions, predictive cabin heating and optimized battery thermal routing have been shown to recover up to 30% of the range typically lost to cold weather."
    }
  ];

  const achievements = [
    { label: "Fleet Carbon Offset", value: "1.2M", unit: "Tons", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Uptime Reliability", value: "99.9", unit: "%", icon: <ShieldCheck className="w-5 h-5" /> },
    { label: "Active EVs Powered", value: "450", unit: "k+", icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-emerge-dark overflow-y-auto hide-scrollbar p-6 md:p-12 pb-32">
      <div className="max-w-4xl mx-auto w-full">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 w-fit">
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">EV Technology <span className="text-emerge-green">&</span> Research</h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Powering the future of mobility with cutting-edge battery science, advanced charging infrastructure, and sustainable energy delivery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {achievements.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-emerge-green/10 text-emerge-green flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <p className="font-display text-4xl font-bold text-white mb-1">
                {item.value}<span className="text-xl text-emerge-green ml-1">{item.unit}</span>
              </p>
              <p className="text-sm text-gray-400">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="font-display text-2xl font-bold text-white mb-6">Latest Research Articles</h2>
        <div className="space-y-6">
          {articles.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (0.1 * i) }}
              onClick={() => setSelectedArticle(i)}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {article.icon}
                </div>
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <h3 className="font-display text-xl font-bold text-white">{article.title}</h3>
                    <span className="text-xs font-mono px-2 py-1 bg-emerge-green/10 text-emerge-green rounded-md shrink-0 w-fit">
                      {article.source}
                    </span>
                  </div>
                  <p className="text-gray-400 leading-relaxed">
                    {article.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-emerge-green/10 border border-emerge-green/20 rounded-3xl p-8 md:p-12 text-center"
        >
          <h2 className="font-display text-3xl font-bold text-white mb-4">Join the Emerge Research Network</h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-8">
            Collaborate with our engineering teams to test beta features and access early-stage charging technologies.
          </p>
          <Button variant="primary" className="px-8 font-medium">Apply for Beta Access</Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedArticle !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-emerge-dark border border-white/10 p-6 md:p-10 rounded-3xl w-full max-w-2xl shadow-2xl relative max-h-[85vh] overflow-y-auto hide-scrollbar"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {articles[selectedArticle].icon}
                </div>
                <div>
                  <span className="text-xs font-mono px-2 py-1 bg-emerge-green/10 text-emerge-green rounded-md shrink-0 w-fit">
                    {articles[selectedArticle].source}
                  </span>
                </div>
              </div>
              
              <h2 className="font-display text-3xl font-bold text-white mb-6">
                {articles[selectedArticle].title}
              </h2>
              
              <div className="prose prose-invert max-w-none">
                {articles[selectedArticle].content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-gray-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
                <Button variant="primary" onClick={() => setSelectedArticle(null)}>Close Article</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
