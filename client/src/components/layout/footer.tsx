import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Leaf, 
  Facebook, 
  Twitter, 
  Instagram, 
  ArrowRight 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-sage-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-sage-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Pure Living Pro</span>
            </div>
            <p className="text-sage-300 mb-4">
              Your trusted partner in holistic wellness and healthy living.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-sage-300 hover:text-white p-2">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-sage-300 hover:text-white p-2">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-sage-300 hover:text-white p-2">
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Wellness</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/blog">
                  <Button variant="ghost" className="text-sage-300 hover:text-white p-0 h-auto">
                    Blog
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/wellness-picks">
                  <Button variant="ghost" className="text-sage-300 hover:text-white p-0 h-auto">
                    Wellness Picks
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/challenges">
                  <Button variant="ghost" className="text-sage-300 hover:text-white p-0 h-auto">
                    Challenges
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/meditation-timer">
                  <Button variant="ghost" className="text-sage-300 hover:text-white p-0 h-auto">
                    Meditation
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Button variant="ghost" className="text-sage-300 hover:text-white p-0 h-auto">
                  Help Center
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="text-sage-300 hover:text-white p-0 h-auto">
                  Contact
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="text-sage-300 hover:text-white p-0 h-auto">
                  About
                </Button>
              </li>
              <li>
                <Link href="/premium">
                  <Button variant="ghost" className="text-sage-300 hover:text-white p-0 h-auto">
                    Premium
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-sage-300 mb-4">Stay updated with our latest wellness tips and insights.</p>
            <div className="flex">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 bg-sage-700 border-sage-600 text-white placeholder-sage-400 rounded-l-lg focus:ring-sage-500"
              />
              <Button className="bg-sage-600 hover:bg-sage-500 px-4 py-2 rounded-r-lg">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-sage-700 mt-12 pt-8 text-center text-sage-300">
          <p>&copy; 2024 Pure Living Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
