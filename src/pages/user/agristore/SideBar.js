import React from 'react'
import  './SideBar.css'
import { Link } from 'react-router-dom'


export default function SideBar() {
  return (
    <>
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse bg-white">
    <div className="position-sticky">
      <div className="list-group list-group-flush mx-3 mt-4">
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple" aria-current="true">
          <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Main dashboard</span>
        </Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple active">
          <i className="fas fa-chart-area fa-fw me-3"></i><span>Webiste traffic</span>
        </Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple"><i
            className="fas fa-lock fa-fw me-3"></i><span>Password</span></Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple"><i
            className="fas fa-chart-line fa-fw me-3"></i><span>Analytics</span></Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple">
          <i className="fas fa-chart-pie fa-fw me-3"></i><span>SEO</span>
        </Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple"><i
            className="fas fa-chart-bar fa-fw me-3"></i><span>Orders</span></Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple"><i
            className="fas fa-globe fa-fw me-3"></i><span>International</span></Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple"><i
            className="fas fa-building fa-fw me-3"></i><span>Partners</span></Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple"><i
            className="fas fa-calendar fa-fw me-3"></i><span>Calendar</span></Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple"><i
            className="fas fa-users fa-fw me-3"></i><span>Users</span></Link>
        <Link to='/agristore' className="list-group-item list-group-item-action py-2 ripple"><i
            className="fas fa-money-bill fa-fw me-3"></i><span>Sales</span></Link>
      </div>
    </div>
  </nav>
  
  <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
  
    <div className="container-fluid">
      {/* <button className="navbar-toggler" type="button" data-mdb-toggle="collapse" data-mdb-target="#sidebarMenu"
        aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <i className="fas fa-bars"></i>
      </button> */}


      {/* <ul className="navbar-nav ms-auto d-flex flex-row">
        <li className="nav-item dropdown">
          <Link className="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow" to='/agristore' id="navbarDropdownMenuLink"
            role="button" data-mdb-toggle="dropdown" aria-expanded="false">
            <i className="fas fa-bell"></i>
            <span className="badge rounded-pill badge-notification bg-danger">1</span>
          </Link>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
            <li>
              <Link className="dropdown-item" to='/agristore'>Some news</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'>Another news</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'>Something else here</Link>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <Link className="nav-link me-3 me-lg-0" to='/agristore'>
            <i className="fas fa-fill-drip"></i>
          </Link>
        </li>
        <li className="nav-item me-3 me-lg-0">
          <Link className="nav-link" to='/agristore'>
            <i className="fab fa-github"></i>
          </Link>
        </li>

        <li className="nav-item dropdown">
          <Link className="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow" to='/agristore' id="navbarDropdown"
            role="button" data-mdb-toggle="dropdown" aria-expanded="false">
            <i className="united kingdom flag m-0"></i>
          </Link>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
            <li>
              <Link className="dropdown-item" to='/agristore'><i className="united kingdom flag"></i>English
                <i className="fa fa-check text-success ms-2"></i></Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'><i className="flag-poland flag"></i>Polski</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'><i className="flag-china flag"></i>中文</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'><i className="flag-japan flag"></i>日本語</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'><i className="flag-germany flag"></i>Deutsch</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'><i className="flag-france flag"></i>Français</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'><i className="flag-spain flag"></i>Español</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'><i className="flag-russia flag"></i>Русский</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'><i className="flag-portugal flag"></i>Português</Link>
            </li>
          </ul>
        </li>

        <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle hidden-arrow d-flex align-items-center" to='/agristore'
            id="navbarDropdownMenuLink" role="button" data-mdb-toggle="dropdown" aria-expanded="false">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (31).webp" className="rounded-circle"
              height="22" alt="Avatar" loading="lazy" />
          </Link>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
            <li>
              <Link className="dropdown-item" to='/agristore'>My profile</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'>Settings</Link>
            </li>
            <li>
              <Link className="dropdown-item" to='/agristore'>Logout</Link>
            </li>
          </ul>
        </li>
      </ul> */}
    </div>
  </nav>
    </>
  )
}
