import Image from "next/image";
import mountains from "../../public/images/bg-home.jpg";

const Header = () => (
  <div className="relative w-full" style={{ height: "70vh" }}>
    <Image
      src={mountains}
      alt="Cover Image"
      fill
      style={{ objectFit: "cover" }}
      priority 
    />
  </div>
);

export default Header;