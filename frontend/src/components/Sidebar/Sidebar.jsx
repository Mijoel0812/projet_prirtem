// frontend/src/components/Sidebar/Sidebar.jsx
import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.css';

const menuConfig = [
  { name: "Tableau de bord", icon: "home-sharp" },
  { name: "Profile", icon: "person-sharp" },
  { name: "Véhicules", icon: "chatbubble-ellipses-sharp" },
  { name: "Chauffeurs", icon: "pie-chart-sharp" },
  { name: "Rapports", icon: "cart-sharp" },
  { name: "Parametre", icon: "cog-sharp" },
];

function Sidebar({ onLogout }) {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const indicatorRef = useRef(null);
  const menuItemsRef = useRef([]);

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  // Fonction pour mettre à jour la position de l'indicateur
  const updateIndicatorPosition = () => {
    const item = menuItemsRef.current[activeIndex];
    
    if (item && indicatorRef.current) {
      indicatorRef.current.style.transform = `translateY(${item.offsetTop}px)`;
    }
  };

  const handleItemClick = (index) => {
    setActiveIndex(index);
  };

  // Mettre à jour la position quand l'index actif change
  useEffect(() => {
    updateIndicatorPosition();
  }, [activeIndex]);

  // Mettre à jour la position quand la sidebar change d'état (toggle)
  useEffect(() => {
    // Petit délai pour attendre la fin de l'animation CSS
    const timer = setTimeout(() => {
      updateIndicatorPosition();
    }, 100);

    return () => clearTimeout(timer);
  }, [isSidebarActive]);

  // Positionner l'indicateur au chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicatorPosition();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Recalculer la position lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  return (
    <aside className={isSidebarActive ? "sidebar active" : "sidebar"}>
      <div className="toggle-btn" onClick={toggleSidebar}>
        <ion-icon name="chevron-forward-sharp"></ion-icon>
      </div>
      
      <ul className="list">
        <li className="item logo">
          <a href="#">
            <div className="icon">
              <ion-icon name="grid-sharp"></ion-icon>
            </div>
            <p className="text">PRIRTEM</p>
          </a>
        </li>

        <div className="menu-list">
          {menuConfig.map((item, index) => (
            <li
              key={index}
              className={activeIndex === index ? "item active" : "item"}
              ref={(el) => (menuItemsRef.current[index] = el)}
              onClick={() => handleItemClick(index)}
            >
              <a href="#">
                <div className="icon">
                  <ion-icon name={item.icon}></ion-icon>
                </div>
                <p className="text">{item.name}</p>
              </a>
            </li>
          ))}
          
          <div className="indicator" ref={indicatorRef}></div>
        </div>

        <li className="item logout-item" onClick={onLogout}>
          <a href="#">
            <div className="icon">
              <ion-icon name="log-out-outline"></ion-icon>
            </div>
            <p className="text">Déconnexion</p>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;