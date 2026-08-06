const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/10 text-slate-400 py-6 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm font-medium tracking-wide gap-4">
        {/* Left: Branding */}
        <div className="text-violet-400 font-bold text-lg">
          CampusEats
        </div>
        
        {/* Center: Creator Name */}
        <div className="text-slate-300">
          Created by <span className="text-emerald-400">Tushar Saini</span>
        </div>
        
        {/* Right: Copyright */}
        <div className="text-slate-500">
          © {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
