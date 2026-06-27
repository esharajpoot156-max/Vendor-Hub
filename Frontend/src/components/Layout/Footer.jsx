const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Vendor Hub — Built for Teyzix Core Internship (FS-2)</p>
        <p>Vendor Management & Quotation System</p>
      </div>
    </footer>
  );
};

export default Footer;