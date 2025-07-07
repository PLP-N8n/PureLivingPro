
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Leaf, Users, Award, Target, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import OptimizedImage from "@/components/shared/OptimizedImage";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Holistic Approach",
      description: "We believe in addressing wellness from every angle - mind, body, and spirit working in harmony."
    },
    {
      icon: Leaf,
      title: "Natural Solutions",
      description: "Prioritizing natural, sustainable remedies and practices that work with your body's natural processes."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Building a supportive community where everyone can share their wellness journey and learn from others."
    },
    {
      icon: Award,
      title: "Evidence-Based",
      description: "All our recommendations are backed by research, expert opinions, and real-world results."
    }
  ];

  const milestones = [
    { year: "2020", title: "Foundation", description: "Pure Living Pro was born from a passion for holistic wellness" },
    { year: "2021", title: "Community Growth", description: "Reached 10,000 readers seeking natural health solutions" },
    { year: "2022", title: "Expert Network", description: "Partnered with wellness practitioners and nutritionists" },
    { year: "2023", title: "Expansion", description: "Launched product recommendations and wellness picks" },
    { year: "2024", title: "Innovation", description: "Introducing personalized wellness journeys and AI-powered recommendations" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-emerald-50">
      {/* New Header Section with Logo */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <OptimizedImage
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7922d7bf4_LogoFinal.jpg"
              alt="Pure Living Pro - About Our Mission"
              className="h-20 w-auto mx-auto"
              width={200}
              height={80}
              crop="fit"
              gravity="center"
              loading="eager"
              quality="auto:best"
              sizes="200px"
              enableModernFormats={true}
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Pure Living Pro
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Empowering your wellness journey through evidence-based insights, 
            natural remedies, and mindful living practices.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <OptimizedImage
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a0fc30eef_Gemini_Generated_Image_va5f3bva5f3bva5f.jpg"
                alt="Smiling woman enjoying a cup of tea, representing the calm focus of Pure Living Pro's mission"
                className="organic-border premium-shadow"
                width={600}
                height={400}
                crop="fill"
                gravity="face"
                loading="lazy"
                quality="auto:good"
              />
            </motion.div>
            <div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-sage-600 dark:text-sage-500 mr-2" />
                  <span className="text-sage-600 dark:text-sage-500 font-medium uppercase tracking-wider text-sm">
                    Our Mission
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-sage-700 dark:text-sage-600 mb-6">
                  Empowering Your Wellness Journey
                </h2>
                <p className="text-lg text-sage-600 dark:text-sage-500 mb-6 leading-relaxed">
                  We're committed to making holistic wellness accessible, understandable, and actionable for everyone. 
                  Through carefully curated content, evidence-based recommendations, and a supportive community, 
                  we help you create lasting positive changes in your life.
                </p>
                <p className="text-lg text-sage-600 dark:text-sage-500 leading-relaxed">
                  Whether you're just beginning your wellness journey or looking to deepen your practice, 
                  Pure Living Pro provides the guidance, tools, and inspiration you need to thrive.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-700 dark:text-sage-600 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-sage-600 dark:text-sage-500 max-w-2xl mx-auto">
              These principles guide everything we do and help us create content that truly serves your wellness goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="premium-shadow organic-border border-0 bg-white dark:bg-gray-800/50 h-full hover:scale-105 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-sage-100 dark:bg-sage-200/20 organic-border flex items-center justify-center mb-6">
                      <value.icon className="w-6 h-6 text-sage-600 dark:text-sage-500" />
                    </div>
                    <h3 className="text-xl font-bold text-sage-700 dark:text-sage-600 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-sage-600 dark:text-sage-500 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-700 dark:text-sage-600 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-sage-600 dark:text-sage-500">
              From a small wellness blog to a thriving community platform
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-sage-200 dark:bg-gray-600"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative flex items-start"
                >
                  <div className="w-16 h-16 bg-sage-600 dark:bg-sage-500 rounded-full flex items-center justify-center text-white font-bold text-sm premium-shadow">
                    {milestone.year}
                  </div>
                  <div className="ml-8 flex-1">
                    <h3 className="text-xl font-bold text-sage-700 dark:text-sage-600 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-sage-600 dark:text-sage-500">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sage-700 dark:text-sage-600 mb-4">
              Meet Our Founder
            </h2>
            <p className="text-lg text-sage-600 dark:text-sage-500 max-w-2xl mx-auto">
              Behind Pure Living Pro is a passion for holistic health and a commitment to your well-being.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <OptimizedImage
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a848b3cca_Gemini_Generated_Image_u2p6pbu2p6pbu2p6.jpg"
                alt="The founder of Pure Living Pro, Chander Vikas"
                className="organic-border premium-shadow"
                width={500}
                height={600}
                crop="fill"
                gravity="face"
                loading="lazy"
                quality="auto:best"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center mb-4">
                <Users className="w-6 h-6 text-sage-600 dark:text-sage-500 mr-2" />
                <span className="text-sage-600 dark:text-sage-500 font-medium uppercase tracking-wider text-sm">
                  Meet Our Founder
                </span>
              </div>
              <h3 className="text-3xl font-bold text-sage-700 dark:text-sage-600 mb-4">
                Chander Vikas
              </h3>
              <p className="text-lg text-sage-600 dark:text-sage-500 mb-6 leading-relaxed">
                With over a decade of experience in wellness and holistic health, Chander founded Pure Living Pro 
                to bridge the gap between ancient wisdom and modern lifestyle needs.
              </p>
              <p className="text-sage-600 dark:text-sage-500 leading-relaxed">
                "My vision is to create a platform where everyone can access authentic, practical wellness guidance 
                that fits into their busy lives while honoring traditional healing practices."
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
