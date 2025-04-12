"use client";
import React from "react";
import {
  Newspaper,
  Calendar,
  Info,
  FileText,
  MessageSquare,
  ArrowRight,
  Image,
} from "lucide-react";
import { useRouter } from "next/navigation";

function DashboardCard({
  icon: Icon,
  title,
  href,
  description,
  colorClasses,
}: {
  icon: React.ElementType;
  title: string;
  href: string;
  description: string;
  colorClasses: string;
}) {
  const router = useRouter();

  return (
    <div
      className={`${colorClasses} rounded-xl p-6 transition-all duration-300 hover:scale-105 cursor-pointer group shadow-lg`}
      onClick={() => router.push(href)}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-8 h-8 text-white" />
        <ArrowRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/90">{description}</p>
    </div>
  );
}

function App() {
  
  const sections = [
    {
      icon: MessageSquare,
      href: "/billboards",
      title: "Carteles",
      description: "Gestiona y visualiza todos los carteles informativos",
      colorClasses: "bg-gradient-to-br from-pink-500 to-rose-600",
    },
    {
      icon: Info,
      href: "/about-us",
      title: "Sobre Nosotros",
      description: "Conoce más sobre nuestra organización y misión",
      colorClasses: "bg-gradient-to-br from-purple-500 to-violet-600",
    },
    {
      icon: Calendar,
      href: "/events",
      title: "Eventos",
      description: "Calendario de próximos eventos y actividades",
      colorClasses: "bg-gradient-to-br from-blue-500 to-indigo-600",
    },
    {
      icon: FileText,
      href: "/relevant-articles",
      title: "Artículos",
      description: "Accede a nuestra biblioteca de artículos",
      colorClasses: "bg-gradient-to-br from-emerald-500 to-green-600",
    },
    {
      icon: Newspaper,
      href: "/news",
      title: "Noticias",
      description: "Mantente al día con las últimas noticias",
      colorClasses: "bg-gradient-to-br from-amber-500 to-orange-600",
    },
    {
      icon: Image,
      title: "Galeria",
      href: "/gallery",
      description: "Explora Galería de Imagenes ",
      colorClasses: "bg-gradient-to-br from-cyan-500 to-teal-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      {/* Header */}
      <header className=" shadow-sm py-6 px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Panel de Control
          </h1>
          <p className="text-gray-600 mt-2">Gestiona tu contenido fácilmente</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <DashboardCard
              key={index}
              icon={section.icon}
              title={section.title}
              href={section.href}
              description={section.description}
              colorClasses={section.colorClasses}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
