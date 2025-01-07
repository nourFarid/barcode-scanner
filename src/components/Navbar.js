import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ margin: 0, padding: 0 }}>
                <div className="container-fluid" style={{ background: "#000000", margin: 0, padding: 0 }}>
                    <a className="navbar-brand" style={{ color: "white" }} href="#">Welcome, Ahmed</a>

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                        <li>
                                <NavLink
                                    to={`/outputs`}
                                    className="nav-link"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#14c6de" : "white"
                                    })}
                                >
                                    المخرجات
                                </NavLink>
                            </li>
                            <li className="nav-item">

                                
                                <NavLink
                                    to={`/`}
                                    className="nav-link"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#14c6de" : "white" // Blue color for active link, white for others
                                    })}
                                    aria-current="page"
                                >
                                    حصيلة اليوم
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={`/transactions`}
                                    className="nav-link"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#14c6de" : "white" // Blue color for active link, white for others
                                    })}
                                    aria-current="page"
                                >
                                   تحويلات
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={`/transactionsMethods`}
                                    className="nav-link"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#14c6de" : "white" // Blue color for active link, white for others
                                    })}
                                    aria-current="page"
                                >
                                   العمليات
                                </NavLink>
                            </li>
     
                            <li className="nav-item">
                                <NavLink
                                    to={`/categories`}
                                    className="nav-link"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#14c6de" : "white"
                                    })}
                                >
                                    الانواع
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={`/productList`}
                                    className="nav-link"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#14c6de" : "white"
                                    })}
                                >
                                    المنتجات
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={`/soldProducts`}
                                    className="nav-link"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#14c6de" : "white"
                                    })}
                                >
                                    المنتجات المباعة
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    to={`/search`}
                                    className="nav-link"
                                    style={({ isActive }) => ({
                                        color: isActive ? "#14c6de" : "white"
                                    })}
                                >
                                    بحث
                                </NavLink>
                                </li>
                           
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
