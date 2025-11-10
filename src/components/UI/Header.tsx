import { AwardIcon, UserIcon } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { currentUser } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className="bg-white text-contrast shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
          onClick={() => navigate("/")}
        >
          <img src="/logo-alt.png" alt="Logo" className="size-6 mr-0.5 mb-0.5" />
          <p className="text-xl text-brand-blue font-logo">Ciudata</p>
        </div>
        <div className="flex items-center space-x-4">
          {/*<div className="flex items-center bg-blue-3 border-1 border-blue-6 text-blue-9 rounded-md px-3 py-1">*/}
          {/*  <AwardIcon size={16} className="mr-1" />*/}
          {/*  <span>{currentUser.points} puntos</span>*/}
          {/*</div>*/}
          <div className="flex items-center">
            <UserIcon size={20} className="mr-1 text-blue-12" />
            <span className="hidden sm:inline text-blue-12">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
