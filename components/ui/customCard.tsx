import { motion } from 'framer-motion'

export const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-lg p-6 md:p-8 shadow-lg space-y-4"
    >
        <h2 className="text-3xl font-semibold text-cyan-300">{title}</h2>
        {children}
    </motion.section>
)
