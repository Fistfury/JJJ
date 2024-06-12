export const Footer = () => {
    return (
      <div className="glass fixed bottom-0 left-0 right-0 z-50 p-2 bg-opacity-50 w-full text-white">
        <div className="flex justify-between items-center w-full p-3">
          <div className="text-sm flex-1">
            © 2024 Triple J
          </div>
          <div className="flex justify-center space-x-4 flex-1">
            <a href="https://www.instagram.com" target="_blank" rel="#">
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="#">
              <i className="fab fa-facebook text-2xl"></i>
            </a>
            <a href="https://www.x.com" target="_blank" rel="#">
              <i className="fab fa-x text-2xl"></i>
            </a>
          </div>
          <div className="flex-1"></div>
        </div>
      </div>
    );
  };
  