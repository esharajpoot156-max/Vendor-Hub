const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        <p>© {new Date().getFullYear()} Vendor Hub </p>
        <p>Vendor Management & Quotation System</p>
      </div>
    </footer>
  );
};

export default Footer;