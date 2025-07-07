import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock,
  Send,
  CheckCircle2,
  Instagram,
  MessageCircle,
  Youtube
} from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { SendEmail } from "@/api/integrations";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get in touch via email",
    contact: "hello@pureliving.pro",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our AI wellness assistant",
    contact: "Available 24/7",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Clock,
    title: "Response Time",
    description: "We typically respond within",
    contact: "24 hours",
    color: "bg-purple-100 text-purple-600"
  }
];

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/pure.living.pro/", icon: Instagram },
  { name: "TikTok", href: "https://www.tiktok.com/@pure.living.pro", icon: Youtube },
  { name: "X / Twitter", href: "https://x.com/pure_living_pro", icon: MessageCircle }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await SendEmail({
        to: "hello@pureliving.pro",
        subject: `Contact Form: ${formData.subject}`,
        body: `
          Name: ${formData.name}
          Email: ${formData.email}
          Subject: ${formData.subject}
          
          Message:
          ${formData.message}
        `
      });

      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitError("Failed to send message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate current URL for SEO
  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : 'https://pureliving.pro/contact';

  // Contact page schema
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Pure Living Pro",
    "description": "Get in touch with Pure Living Pro for wellness questions, support, or collaboration opportunities.",
    "url": currentUrl,
    "mainEntity": {
      "@type": "Organization",
      "name": "Pure Living Pro",
      "email": "hello@pureliving.pro",
      "url": "https://pureliving.pro",
      "logo": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7922d7bf4_LogoFinal.jpg",
      "sameAs": [
        "https://www.instagram.com/pure.living.pro/",
        "https://www.tiktok.com/@pure.living.pro",
        "https://x.com/pure_living_pro"
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* SEO Meta Tags */}
      <SEOHead
        title="Contact Us - Get in Touch"
        description="Contact Pure Living Pro for wellness questions, support, or collaboration opportunities. We're here to help you on your wellness journey."
        keywords={[
          'contact pure living pro',
          'wellness support',
          'customer service',
          'wellness questions',
          'collaboration',
          'help'
        ]}
        canonicalUrl={currentUrl}
        ogTitle="Contact Pure Living Pro - We're Here to Help"
        ogDescription="Get in touch with our wellness experts for questions, support, or collaboration opportunities."
        ogImage="/images/contact-og.jpg"
        schema={contactSchema}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-sage-100 text-sage-700 border-sage-200 px-4 py-2 text-sm font-medium rounded-full mb-6">
            <Mail className="w-4 h-4 mr-2" />
            Get in Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            We'd Love to Hear From You
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you have questions about wellness, need support with our platform, 
            or want to explore collaboration opportunities, we're here to help.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-3">{method.description}</p>
                  <p className="font-medium text-sage-700">{method.contact}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">Send us a Message</CardTitle>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="rounded-xl"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-xl"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="rounded-xl"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="rounded-xl"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  {submitError && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-xl">
                      {submitError}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-sage-600 hover:bg-sage-700 text-white py-3 rounded-xl"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Connect With Us</CardTitle>
                <p className="text-gray-600">
                  Follow us on social media for daily wellness tips and updates.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a 
                        key={social.name}
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center text-sage-600 hover:bg-sage-200 transition-colors"
                      >
                        <IconComponent className="w-6 h-6" />
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    How quickly do you respond to inquiries?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Do you offer wellness consultations?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Yes! Our premium members get access to personalized wellness consultations.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Can I contribute content to your platform?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    We're always looking for wellness experts to collaborate with. Reach out to discuss opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}