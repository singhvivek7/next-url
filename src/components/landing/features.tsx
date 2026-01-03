"use client";

import { motion } from "motion/react";
import {
    Zap,
    BarChart3,
    Shield,
    Palette,
    Code2,
    Globe,
} from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Global Edge Network",
        description: "Requests are routed to the nearest edge location for sub-50ms latency worldwide.",
    },
    {
        icon: BarChart3,
        title: "Real-time Telemetry",
        description: "Live stream of click events with granular data on device, location, and OS.",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "SOC 2 Type II compliant infrastructure with SSO enforcement and audit logs.",
    },
    {
        icon: Palette,
        title: "Domain Management",
        description: "Connect unlimited custom domains with automatic SSL provisioning and renewal.",
    },
    {
        icon: Code2,
        title: "Robust API",
        description: "Programmatic access to all features via our typed REST API and SDKs.",
    },
    {
        icon: Globe,
        title: "Smart Routing",
        description: "Dynamically redirect traffic based on geolocation, language, or device type.",
    },
];

export const Features = () => {
    return (
        <section id="features" className="py-24 bg-background border-b border-border">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-6 md:p-10 bg-background hover:bg-card transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg border border-border flex items-center justify-center mb-6 text-primary bg-primary/5 group-hover:border-primary/20 transition-all duration-300">
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
