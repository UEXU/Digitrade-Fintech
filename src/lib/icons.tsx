import React from 'react';
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  Briefcase, 
  Globe, 
  ShieldCheck, 
  Users, 
  Building2, 
  Zap, 
  Heart, 
  Star, 
  Award, 
  Clock, 
  MessageSquare,
  Mail,
  Phone,
  Layout,
  Database,
  Code,
  Cloud
} from 'lucide-react';

export const getLucideIcon = (name?: string, className?: string) => {
  const props = { className: className || "w-6 h-6" };
  
  switch (name) {
    case 'Search': return <Search {...props} />;
    case 'MapPin': return <MapPin {...props} />;
    case 'TrendingUp': return <TrendingUp {...props} />;
    case 'Briefcase': return <Briefcase {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'ShieldCheck': return <ShieldCheck {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Building2': return <Building2 {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'Heart': return <Heart {...props} />;
    case 'Star': return <Star {...props} />;
    case 'Award': return <Award {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'MessageSquare': return <MessageSquare {...props} />;
    case 'Mail': return <Mail {...props} />;
    case 'Phone': return <Phone {...props} />;
    case 'Layout': return <Layout {...props} />;
    case 'Database': return <Database {...props} />;
    case 'Code': return <Code {...props} />;
    case 'Cloud': return <Cloud {...props} />;
    default: return <Briefcase {...props} />;
  }
};
