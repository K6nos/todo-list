import { Link } from "react-router-dom";
import { FcHome, FcPlus, FcDeleteDatabase, FcSearch } from "react-icons/fc";

function Navigation() {
  return (
    <nav className="bg-gray-100 pt-6 text-center space-x-6">
      <Link to="/" className="inline-flex items-center space-x-1">
        <FcHome size={20} />
        <span>一覧</span>
      </Link> 
      | 
      <Link to="/add" className="inline-flex items-center space-x-1">
        <FcPlus size={20} />
        <span>ユーザー追加</span>
      </Link> 
      | 
      <Link to="/delete" className="inline-flex items-center space-x-1">
        <FcDeleteDatabase size={20} />
        <span>ユーザー削除</span>
      </Link> 
      | 
      <Link to="/find" className="inline-flex items-center space-x-1">
        <FcSearch size={20} />
        <span>検索</span>
      </Link> 
      |
    </nav>
  );
}

export default Navigation;
