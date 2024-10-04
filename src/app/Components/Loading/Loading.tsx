// components/Loading/Loading.tsx
import React from "react";
import "./Loading.css"; // create some styles for loading
import Logo_icon from "../../Assets/Logo_icon/Logo_icon";

const Loading: React.FC = () => {
  return (
    <div className="aa">
      {/* You can customize this to any kind of loader/animation you prefer */}
      <img src="https://res.cloudinary.com/dr0nki74e/image/upload/f_auto,q_auto/v1/friendly/cjwtj5vdnkw2vkvnlbtm"></img>
      <p>Carregando, por favor aguarde.</p>
    </div>
  );
};

export default Loading;
